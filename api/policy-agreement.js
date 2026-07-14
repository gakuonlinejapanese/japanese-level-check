import { getAdminClient } from "./_supabaseAdmin.js";
import { sendEmail } from "./_resend.js";
import { ADMIN_EMAIL } from "./_supabaseAdmin.js";

// POST { name, email, plan, userId } — called right before a student is
// allowed to proceed to a payment step (either the direct Stripe checkout
// for app-only plans, or the lesson request/application page for plans
// that include lessons). Records the agreement with a timestamp so there's
// a durable record the student did tick "I agree to all terms", and emails
// Seito a copy for their own records.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { name, email, plan, userId } = req.body || {};
    if (!email) return res.status(400).json({ error: "email is required" });

    const supabase = getAdminClient();
    const agreedAt = new Date().toISOString();

    const { error: insertErr } = await supabase.from("policy_agreements").insert({
      user_id: userId || null,
      name: name || null,
      email: email.trim().toLowerCase(),
      plan: plan || null,
      agreed_at: agreedAt,
    });
    if (insertErr) return res.status(500).json({ error: insertErr.message });

    const html = `
      <p>A student agreed to the GAKU terms just before proceeding to payment.</p>
      <p><strong>Name:</strong> ${name || "(not provided)"}<br/>
         <strong>Email:</strong> ${email}<br/>
         <strong>Plan:</strong> ${plan || "(unspecified)"}<br/>
         <strong>Agreed at:</strong> ${agreedAt}</p>
    `;
    try {
      await sendEmail({ to: ADMIN_EMAIL, subject: "[GAKU] Policy agreement recorded", html });
    } catch (e) {
      // Don't block the student's checkout flow just because the notification email failed —
      // the agreement is already durably recorded in policy_agreements above.
      console.error("Failed to send policy-agreement notification email:", e.message);
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
