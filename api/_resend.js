// Store-app "guest" accounts (no registration) get a placeholder address on our own domain
// (guest-<24 hex>@seitojapanese.online). It is never a real mailbox, so mail to it must never be
// sent (it would only bounce and hurt the sender reputation).
export function isGuestEmail(email) {
  return /^guest-[0-9a-f]{24}@seitojapanese\.online$/i.test(String(email || "").trim());
}

export async function sendEmail({ to, subject, html, attachments, replyTo }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY not configured");
  const toList = (Array.isArray(to) ? to : [to]).filter((e) => e && !isGuestEmail(e));
  if (toList.length === 0) return { skipped: true, reason: "guest or empty recipient" };
  const body = {
    sender: { name: "GAKU Online Japanese", email: "noreply@seitojapanese.online" },
    to: toList.map((email) => ({ email })),
    subject,
    htmlContent: html,
  };
  if (replyTo) body.replyTo = { email: replyTo };
  // attachments: [{ name, base64 }] — Brevo expects base64 content (no data: prefix) per attachment
  if (Array.isArray(attachments) && attachments.length > 0) {
    body.attachment = attachments.map((a) => ({ name: a.name, content: a.base64 }));
  }
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Brevo error (${res.status}): ${errText}`);
  }
  return res.json();
}
