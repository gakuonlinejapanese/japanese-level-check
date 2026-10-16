import { getAdminClient } from "./_supabaseAdmin.js";
import { sendEmail } from "./_resend.js";

const APP_URL = "https://app.seitojapanese.online";

// Sign-up that does NOT depend on Supabase's built-in email sender (which is
// rate limited and was set to 0/hour). We create the unconfirmed user and get
// the confirmation link from Supabase, then send the email ourselves via Brevo.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { email: rawEmail, password } = req.body || {};
    const email = String(rawEmail || "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const admin = getAdminClient();
    const { data, error } = await admin.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: { redirectTo: APP_URL },
    });

    if (error) {
      const msg = String(error.message || "");
      if (error.code === "email_exists" || /already (been )?registered|already exists/i.test(msg)) {
        return res.status(200).json({ alreadyRegistered: true });
      }
      return res.status(400).json({ error: msg || "Could not create account." });
    }

    const link = data?.properties?.action_link;
    const userId = data?.user?.id;
    if (!link || !userId) return res.status(500).json({ error: "Could not create confirmation link." });

    await sendEmail({
      to: email,
      subject: "Confirm your GAKU Master account",
      html: `
        <h2 style="margin:0 0 16px;">Welcome to GAKU Master!</h2>
        <p>Thank you for signing up. Please confirm your email address by clicking the button below.</p>
        <p style="margin:24px 0;"><a href="${link}" style="background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Confirm my email</a></p>
        <p style="font-size:12px;color:#666;">If the button does not work, copy and paste this link into your browser:<br/>${link}</p>
        <p>If you did not sign up, you can ignore this email.</p>
        <p>Best regards,<br/>Seito — GAKU Online Japanese</p>`,
    });

    return res.status(200).json({ ok: true, userId });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
