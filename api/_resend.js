export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY not configured");
  const toList = Array.isArray(to) ? to : [to];
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: "GAKU Online Japanese", email: "noreply@seitojapanese.online" },
      to: toList.map((email) => ({ email })),
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Brevo error (${res.status}): ${errText}`);
  }
  return res.json();
}
