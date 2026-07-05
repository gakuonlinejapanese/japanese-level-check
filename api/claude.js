export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { messages, max_tokens } = req.body;
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

    // --- Primary provider: DeepInfra (OpenAI-compatible) ---
    const deepInfraKey = process.env.DEEPINFRA_API_KEY;

    if (deepInfraKey) {
      const deepInfraBody = JSON.stringify({
        model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        ...commonBody,
      });

      // Retry a couple of times on transient 429s from DeepInfra before
      // giving up and falling back to Groq.
      const maxAttempts = 3;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          const response = await fetch("https://api.deepinfra.com/v1/openai/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${deepInfraKey}`,
            },
            body: deepInfraBody,
          });

          if (response.status === 429) {
            if (attempt < maxAttempts - 1) {
              await new Promise(r => setTimeout(r, 400 * (attempt + 1)));
              continue;
            }
            break; // exhausted retries, fall through to Groq fallback
          }

          const data = await response.json();

          if (response.ok) {
            const text = data.choices?.[0]?.message?.content || "";
            return res.status(200).json({ content: [{ type: "text", text }] });
          }
          break; // non-retryable error from DeepInfra, fall through to Groq fallback
        } catch (e) {
          break; // network error calling DeepInfra, fall through to Groq fallback
        }
      }
    }

    // --- Fallback provider: Groq (multi-key rotation) ---
    const groqKeys = [
      process.env.GROQ_API_KEY,
      process.env.GROQ_API_KEY_2,
      process.env.GROQ_API_KEY_3,
      process.env.GROQ_API_KEY_4,
      process.env.GROQ_API_KEY_5,
    ].filter(Boolean);

    if (groqKeys.length === 0) {
      return res.status(500).json({ error: "No API keys configured (DeepInfra failed and no Groq fallback available)" });
    }

    const groqBody = JSON.stringify({
      model: "llama-3.3-70b-versatile",
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
        body: groqBody,
      });

      const data = await response.json();

      if (response.status === 429) {
        // Rate limited on this key — try next key
        lastError = data.error?.message || "Rate limit exceeded";
        continue;
      }

      if (!response.ok) {
        return res.status(response.status).json({ error: data.error?.message || "Groq API error" });
      }

      const text = data.choices?.[0]?.message?.content || "";
      return res.status(200).json({ content: [{ type: "text", text }] });
    }

    // All keys exhausted
    return res.status(429).json({ error: `All API keys rate limited. ${lastError}` });

  } catch (error) {
    return res.status(500).json({ error: "Failed to call API", details: error.message });
  }
}
