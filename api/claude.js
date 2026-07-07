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
        return res.status(200).json({ content: [{ type: "text", text: groqResult.text }] });
      }
      const text = await callDeepInfra(deepInfraKey, commonBody);
      if (text !== null) {
        return res.status(200).json({ content: [{ type: "text", text }] });
      }
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
