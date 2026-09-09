async function callDeepInfra(deepInfraKey, commonBody) {
  if (!deepInfraKey) return null;

  const body = JSON.stringify({
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    ...commonBody,
  });

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
        body,
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

async function callGroq(groqKeys, commonBody, model = "llama-3.3-70b-versatile") {
  if (!groqKeys.length) return { text: null, lastError: "No Groq keys configured" };

  const body = JSON.stringify({
    model,
    ...commonBody,
  });

  let lastError = null;
  for (let i = 0; i < groqKeys.length; i++) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqKeys[i]}`,
      },
      body,
    });

    const data = await response.json();

    if (response.status === 429) {
      lastError = data.error?.message || "Rate limit exceeded";
      continue; // try next key
    }

    if (!response.ok) {
      return { text: null, lastError: data.error?.message || "Groq API error", status: response.status };
    }

    return { text: data.choices?.[0]?.message?.content || "" };
  }

  return { text: null, lastError: `All Groq keys rate limited. ${lastError}` };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { messages, max_tokens, provider, frequency_penalty } = req.body;
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
    const groqKeys = [
      process.env.GROQ_API_KEY,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4,
      process.env.GROQ_API_KEY_5,
    ].filter(Boolean);

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

    // provider === "turbo": Groq's llama-3.1-8b-instant — several times faster token
    // throughput than the 70B model, for large-output generation (many exercises/turns
    // at once) where speed matters most. Falls back to "fast" (70B) if it fails.
    //
    // provider === "fast": prioritize Groq 70B (speed + quality) for important, user-facing
    // experiences, falling back to DeepInfra if Groq is unavailable.
    //
    // default (no provider specified): prioritize DeepInfra (cost) for short,
    // high-volume lookups, falling back to Groq if DeepInfra fails.
    if (provider === "turbo") {
      const turboResult = await callGroq(groqKeys, commonBody, "llama-3.1-8b-instant");
      if (turboResult.text !== null) {
        return res.status(200).json({ content: [{ type: "text", text: turboResult.text }] });
      }
      const groqResult = await callGroq(groqKeys, commonBody);
      if (groqResult.text !== null) {
        return res.status(200).json({ content: [{ type: "text", text: groqResult.text }] });
      }
      const text = await callDeepInfra(deepInfraKey, commonBody);
      if (text !== null) {
        return res.status(200).json({ content: [{ type: "text", text }] });
      }
      return res.status(groqResult.status || 429).json({ error: groqResult.lastError || "Both providers failed" });
    }

    if (provider === "fast") {
      const groqResult = await callGroq(groqKeys, commonBody);
      if (groqResult.text !== null) {
        console.log("provider=fast: Groq OK");
        return res.status(200).json({ content: [{ type: "text", text: groqResult.text }] });
      }
      console.error("provider=fast: Groq FAILED —", groqResult.lastError);
      const text = await callDeepInfra(deepInfraKey, commonBody);
      if (text !== null) {
        console.log("provider=fast: DeepInfra fallback OK");
        return res.status(200).json({ content: [{ type: "text", text }] });
      }
      console.error("provider=fast: DeepInfra fallback also FAILED");
      return res.status(groqResult.status || 429).json({ error: groqResult.lastError || "Both providers failed" });
    }

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
