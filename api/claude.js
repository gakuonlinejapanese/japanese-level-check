export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, max_tokens } = req.body;
    const userMessage = messages?.[messages.length - 1]?.content || "";

    // Use Groq's free API - fast and free with no billing required
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        max_tokens: max_tokens || 1200,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "Groq API error" });
    }

    const text = data.choices?.[0]?.message?.content || "";
    return res.status(200).json({ content: [{ type: "text", text }] });

  } catch (error) {
    return res.status(500).json({ error: "Failed to call API", details: error.message });
  }
}
