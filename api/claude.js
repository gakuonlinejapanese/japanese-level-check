export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const { messages, max_tokens } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://japanese-level-check.vercel.app",
        "X-Title": "Gaku Japanese Learning App",
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: messages,
        max_tokens: max_tokens || 1200,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "OpenRouter API error" });
    }

    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ content: [{ type: "text", text }] });

  } catch (error) {
    return res.status(500).json({ error: "Failed to call API", details: error.message });
  }
}
