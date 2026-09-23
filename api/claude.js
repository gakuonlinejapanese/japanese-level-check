// ---- Model IDs -------------------------------------------------------------
// NOTE (2026-09-24): Groq retired llama-3.3-70b-versatile and llama-3.1-8b-instant
// (deprecated 2026-08-16 for free/developer tiers; Groq recommends openai/gpt-oss-120b
// and gpt-oss-20b instead). Every provider:"fast"/"turbo" request was first hitting the
// dead Groq model, failing, and only then falling back to DeepInfra — a wasted round
// trip on every AI call, which is what made Create From Content feel so slow.
const DEEPINFRA_LEGACY_MODEL = "meta-llama/Llama-3.3-70B-Instruct-Turbo";
const DEEPINFRA_CONTENT_MODEL = "openai/gpt-oss-120b-Turbo";
const GROQ_DEFAULT_MODEL = "openai/gpt-oss-120b";
const GROQ_CONTENT_MODEL = "openai/gpt-oss-120b";

const isGptOss = (model) => /gpt-oss/i.test(model || "");

// gpt-oss models "think" before answering and those reasoning tokens count against
// max_tokens. Keep reasoning low (this is generation, not puzzle-solving) and give a
// little extra headroom so long JSON answers never get cut off mid-way.
function buildModelBody(commonBody, model) {
  if (!isGptOss(model)) return { ...commonBody };
  return {
    ...commonBody,
    max_tokens: Math.min((commonBody.max_tokens || 1200) + 1000, 9000),
    reasoning_effort: "low",
  };
}

async function callDeepInfra(deepInfraKey, commonBody, model = DEEPINFRA_LEGACY_MODEL) {
  if (!deepInfraKey) return null;

  let payload = { model, ...buildModelBody(commonBody, model) };

  // Retry a couple of times on transient 429s from DeepInfra before giving up.
  const maxAttempts = 3;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch("https://api.deepinfra.com/v1/openai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${deepInfraKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 429) {
        if (attempt < maxAttempts - 1) {
          await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
          continue;
        }
        return null; // exhausted retries
      }

      const data = await response.json();
      if (response.ok) {
        return data.choices?.[0]?.message?.content || "";
      }
      // If a model rejects the reasoning_effort parameter, retry once without it.
      if (response.status === 400 && payload.reasoning_effort) {
        const { reasoning_effort, ...rest } = payload;
        payload = rest;
        continue;
      }
      return null; // non-retryable error
    } catch (e) {
      return null; // network error
    }
  }
  return null;
}

async function callDeepInfraVision(deepInfraKey, commonBody) {
  if (!deepInfraKey) return null;

  const body = JSON.stringify({
    model: "Qwen/Qwen3-VL-235B-A22B-Instruct",
    ...commonBody,
  });

  try {
    const response = await fetch("https://api.deepinfra.com/v1/openai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${deepInfraKey}`,
      },
      body,
    });

    const data = await response.json();
    if (response.ok) {
      return data.choices?.[0]?.message?.content || "";
    }
    return null; // non-retryable error
  } catch (e) {
    return null; // network error
  }
}

async function callGroq(groqKeys, commonBody, model = GROQ_DEFAULT_MODEL) {
  if (!groqKeys.length) return { text: null, lastError: "No Groq keys configured" };

  const body = JSON.stringify({
    model,
    ...buildModelBody(commonBody, model),
  });

  let lastError = null;
  for (let i = 0; i < groqKeys.length; i++) {
    let response, data;
    try {
      response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${groqKeys[i]}`,
        },
        body,
      });
      data = await response.json();
    } catch (e) {
      lastError = e.message;
      continue; // network error — try next key
    }

    if (response.status === 429) {
      lastError = data.error?.message || "Rate limit exceeded";
      continue; // try next key
    }

    if (!response.ok) {
      return { text: null, lastError: data.error?.message || "Groq API error", status: response.status };
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      // Empty reply (e.g. reasoning used up the token budget) — treat as a failure so the
      // caller falls through to the next provider instead of returning a blank answer.
      return { text: null, lastError: "Empty response from Groq" };
    }
    return { text };
  }

  return { text: null, lastError: `All Groq keys rate limited. ${lastError}` };
}

// Groq's audio transcription endpoint (Whisper large-v3) — unlike callGroq above,
// this is multipart/form-data (a file upload), not a JSON chat completion, so it
// gets its own request builder. Used by provider === "whisper" for GAKU Reader's
// 🎧 listening answer-explanation scan mode: the extension records the tab's
// audio while the student replays a JLPT listening question, base64-encodes it,
// and sends it here to get a Japanese transcript back.
async function callGroqWhisper(groqKeys, audioBuffer, mimeType) {
  if (!groqKeys.length) return { text: null, lastError: "No Groq keys configured" };

  let lastError = null;
  for (let i = 0; i < groqKeys.length; i++) {
    try {
      const form = new FormData();
      const ext = (mimeType || "").includes("webm") ? "webm" : "wav";
      form.append("file", new Blob([audioBuffer], { type: mimeType || "audio/webm" }), `audio.${ext}`);
      form.append("model", "whisper-large-v3");
      form.append("language", "ja"); // JLPT listening audio is Japanese
      form.append("response_format", "json");

      const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKeys[i]}`,
        },
        body: form,
      });

      const data = await response.json();

      if (response.status === 429) {
        lastError = data.error?.message || "Rate limit exceeded";
        continue; // try next key
      }

      if (!response.ok) {
        return { text: null, lastError: data.error?.message || "Groq transcription error", status: response.status };
      }

      return { text: data.text || "" };
    } catch (e) {
      lastError = e.message;
      continue;
    }
  }

  return { text: null, lastError: `All Groq keys rate limited or failed for transcription. ${lastError}` };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, max_tokens, provider, frequency_penalty, audioBase64, mimeType } = req.body;

    const groqKeys = [
      process.env.GROQ_API_KEY,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4,
      process.env.GROQ_API_KEY_5,
    ].filter(Boolean);

    // provider === "whisper": audio transcription for GAKU Reader's 🎧 listening
    // scan mode. Body shape is different from every other provider here — no
    // `messages`, just base64 audio — so this is handled before the chat-message
    // parsing below, and returns { text } directly (not the { content: [...] }
    // shape the chat providers use) since background.js reads resp.text for this.
    if (provider === "whisper") {
      if (!audioBase64) {
        return res.status(400).json({ error: "Missing audioBase64" });
      }
      const audioBuffer = Buffer.from(audioBase64, "base64");
      const whisperResult = await callGroqWhisper(groqKeys, audioBuffer, mimeType);
      if (whisperResult.text !== null) {
        console.log("provider=whisper: Groq OK");
        return res.status(200).json({ text: whisperResult.text });
      }
      console.error("provider=whisper: Groq FAILED —", whisperResult.lastError);
      return res.status(whisperResult.status || 429).json({ error: whisperResult.lastError || "Transcription failed" });
    }

    const systemMessage = messages?.find(m => m.role === "system");
    const userMessages = messages?.filter(m => m.role !== "system") || [];
    const chatMessages = systemMessage
      ? [{ role: "system", content: systemMessage.content }, ...userMessages]
      : userMessages;

    const commonBody = {
      messages: chatMessages,
      max_tokens: Math.min(max_tokens || 1200, 8000),
      temperature: 0.3,
    };

    if (typeof frequency_penalty === "number") {
      commonBody.frequency_penalty = Math.max(-2, Math.min(2, frequency_penalty));
    }

    const deepInfraKey = process.env.DEEPINFRA_API_KEY;

    // provider === "vision": GAKU Reader's screenshot-scan feature (問題作成/JLPT解答解説
    // modes). messages already contain multimodal content parts (an image_url data-URI
    // alongside the text prompt), built by the caller — this branch just routes to a
    // vision-capable Groq model instead of the text-only 70B model. Always called from
    // background.js (extension context, exempt from CORS), never directly from content.js,
    // since chrome.tabs.captureVisibleTab() is itself background/service-worker-only. No
    // NOTE (2026-09-08): meta-llama/llama-4-scout-17b-16e-instruct was deprecated by Groq
    // on 2026-06-17. Switched to qwen/qwen3.6-27b, Groq's recommended vision-capable
    // successor — note this is currently a Groq "preview" model, not GA/production-tier.
    // NOTE (2026-09-09): this account's on-demand tier caps qwen3.6-27b at 1000 output
    // tokens/min, which thinking-enabled requests blow past almost immediately. Added a
    // DeepInfra fallback (Qwen3-VL-235B-A22B-Instruct) below for when Groq rate-limits or
    // errors out, so the scan feature degrades gracefully instead of failing outright.
    if (provider === "vision") {
      // reasoning_format:"hidden" keeps qwen3.6-27b's internal thinking out of the
      // visible response (no more "Wait, let me look again..." leaking through).
      // Deliberately NOT setting reasoning_effort:"none" — that disabled reasoning
      // entirely and hurt answer accuracy on grammar questions. Letting the model
      // actually think (just not show it) trades a few more tokens for correctness.
      const visionBody = { ...commonBody, reasoning_format: "hidden" };
      const visionResult = await callGroq(groqKeys, visionBody, "qwen/qwen3.6-27b");
      if (visionResult.text !== null) {
        console.log("provider=vision: Groq OK");
        return res.status(200).json({ content: [{ type: "text", text: visionResult.text }] });
      }
      console.error("provider=vision: Groq FAILED —", visionResult.lastError);
      const deepInfraVisionText = await callDeepInfraVision(deepInfraKey, commonBody);
      if (deepInfraVisionText !== null) {
        console.log("provider=vision: DeepInfra fallback OK");
        return res.status(200).json({ content: [{ type: "text", text: deepInfraVisionText }] });
      }
      console.error("provider=vision: DeepInfra fallback also FAILED");
      return res.status(visionResult.status || 429).json({ error: visionResult.lastError || "Vision provider failed" });
    }

    // provider === "content": Create From Content — a long, structured-JSON generation where
    // speed matters most. Groq's openai/gpt-oss-120b (~500 tokens/s) first; then DeepInfra's
    // gpt-oss-120b-Turbo; then the older DeepInfra Llama as a last resort. Empty replies count
    // as failures. Timings are logged so the fastest option can be confirmed from Vercel logs.
    if (provider === "content") {
      const t0 = Date.now();
      const groqResult = await callGroq(groqKeys, commonBody, GROQ_CONTENT_MODEL);
      if (groqResult.text) {
        console.log(`provider=content: Groq ${GROQ_CONTENT_MODEL} OK in ${Date.now() - t0}ms`);
        return res.status(200).json({ content: [{ type: "text", text: groqResult.text }] });
      }
      console.error("provider=content: Groq FAILED —", groqResult.lastError);

      const t1 = Date.now();
      const turboText = await callDeepInfra(deepInfraKey, commonBody, DEEPINFRA_CONTENT_MODEL);
      if (turboText) {
        console.log(`provider=content: DeepInfra ${DEEPINFRA_CONTENT_MODEL} OK in ${Date.now() - t1}ms`);
        return res.status(200).json({ content: [{ type: "text", text: turboText }] });
      }
      console.error(`provider=content: DeepInfra ${DEEPINFRA_CONTENT_MODEL} FAILED`);

      const t2 = Date.now();
      const legacyText = await callDeepInfra(deepInfraKey, commonBody);
      if (legacyText) {
        console.log(`provider=content: DeepInfra legacy Llama OK in ${Date.now() - t2}ms`);
        return res.status(200).json({ content: [{ type: "text", text: legacyText }] });
      }
      console.error("provider=content: all providers FAILED");
      return res.status(groqResult.status || 502).json({ error: groqResult.lastError || "All providers failed" });
    }

    // provider === "fast" / "turbo": these used to route to Groq's llama-3.3-70b-versatile /
    // llama-3.1-8b-instant, both retired (see note at the top). Trying Groq first only added a
    // failed round trip to every call, so go straight to DeepInfra (the model that was actually
    // answering these requests anyway) and keep Groq's current model as the fallback.
    if (provider === "fast" || provider === "turbo") {
      const t0 = Date.now();
      const text = await callDeepInfra(deepInfraKey, commonBody);
      if (text !== null) {
        console.log(`provider=${provider}: DeepInfra OK in ${Date.now() - t0}ms`);
        return res.status(200).json({ content: [{ type: "text", text }] });
      }
      console.error(`provider=${provider}: DeepInfra FAILED`);
      const groqResult = await callGroq(groqKeys, commonBody);
      if (groqResult.text) {
        console.log(`provider=${provider}: Groq fallback OK`);
        return res.status(200).json({ content: [{ type: "text", text: groqResult.text }] });
      }
      console.error(`provider=${provider}: Groq fallback also FAILED —`, groqResult.lastError);
      return res.status(groqResult.status || 429).json({ error: groqResult.lastError || "Both providers failed" });
    }

    // default (no provider specified): prioritize DeepInfra (cost) for short,
    // high-volume lookups, falling back to Groq if DeepInfra fails.
    const text = await callDeepInfra(deepInfraKey, commonBody);
    if (text !== null) {
      return res.status(200).json({ content: [{ type: "text", text }] });
    }
    const groqResult = await callGroq(groqKeys, commonBody);
    if (groqResult.text !== null) {
      return res.status(200).json({ content: [{ type: "text", text: groqResult.text }] });
    }
    return res.status(groqResult.status || 429).json({ error: groqResult.lastError || "Both providers failed" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to call API", details: error.message });
  }
}
