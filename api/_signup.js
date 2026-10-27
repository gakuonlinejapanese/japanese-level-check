import { getAdminClient } from "./_supabaseAdmin.js";
import { sendEmail } from "./_resend.js";

const APP_URL = "https://app.seitojapanese.online";

function confirmationHtml(link) {
  return `
        <h2 style="margin:0 0 16px;">Welcome to GAKU Master!</h2>
        <p>Thank you for signing up. Please confirm your email address by clicking the button below.</p>
        <p style="margin:24px 0;"><a href="${link}" style="background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Confirm my email</a></p>
        <p style="font-size:12px;color:#666;">If the button does not work, copy and paste this link into your browser:<br/>${link}</p>
        <p>If you did not sign up, you can ignore this email.</p>
        <p>Best regards,<br/>Seito — GAKU Online Japanese</p>`;
}

// Sign-up that does NOT depend on Supabase's built-in email sender (which is
// rate limited and was set to 0/hour). We create the unconfirmed user and get
// the confirmation link from Supabase, then send the email ourselves via Brevo.
export async function handleSignup(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { email: rawEmail, password, resend, pendingForm } = req.body || {};
    const email = String(rawEmail || "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    const admin = getAdminClient();

    // Re-send the confirmation email for an account that exists but was never confirmed (the
    // original email didn't arrive / was missed). Only ever emails the address itself, and does
    // nothing for confirmed accounts. The password is never touched here.
    // Keep the QuickStart answers with the ACCOUNT (not just the browser), so a confirmation link
    // opened in another browser / in-app webview still lands the student on their dashboard
    // instead of asking the same questions again.
    const stashForm = async (userId) => {
      try {
        if (!userId || !pendingForm || typeof pendingForm !== "object") return;
        const json = JSON.stringify(pendingForm);
        if (json.length > 4000) return;
        await admin.auth.admin.updateUserById(userId, { user_metadata: { pending_form: pendingForm } });
      } catch (e) { console.error("[signup] stash form failed:", e.message); }
    };
    const resendConfirmation = async () => {
      const { data: ml, error: mlErr } = await admin.auth.admin.generateLink({
        type: "magiclink", email, options: { redirectTo: APP_URL },
      });
      if (mlErr || !ml?.user) return { sent: false, confirmed: false, notFound: true };
      if (ml.user.email_confirmed_at) return { sent: false, confirmed: true, userId: ml.user.id };
      const link = ml.properties?.action_link;
      if (!link) return { sent: false, confirmed: false };
      await stashForm(ml.user.id);
      await sendEmail({
        to: email,
        subject: "Confirm your GAKU Master account",
        html: confirmationHtml(link),
      });
      return { sent: true, confirmed: false, userId: ml.user.id };
    };
    if (resend) {
      const r = await resendConfirmation();
      return res.status(200).json({ ok: true, resent: r.sent, alreadyConfirmed: r.confirmed });
    }

    if (!password || String(password).length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    const { data, error } = await admin.auth.admin.generateLink({
      type: "signup",
      email,
      password,
      options: { redirectTo: APP_URL },
    });

    if (error) {
      const msg = String(error.message || "");
      if (error.code === "email_exists" || /already (been )?registered|already exists/i.test(msg)) {
        // An account that was created but never confirmed is not a real "already registered"
        // case — the student just never got/saw the email. Send a fresh confirmation instead.
        const r = await resendConfirmation();
        if (r.sent) return res.status(200).json({ ok: true, userId: r.userId, needsConfirmation: true, resentConfirmation: true });
        return res.status(200).json({ alreadyRegistered: true });
      }
      return res.status(400).json({ error: msg || "Could not create account." });
    }

    const link = data?.properties?.action_link;
    const userId = data?.user?.id;
    if (!link || !userId) return res.status(500).json({ error: "Could not create confirmation link." });
    await stashForm(userId);

    await sendEmail({
      to: email,
      subject: "Confirm your GAKU Master account",
      html: confirmationHtml(link),
    });

    return res.status(200).json({ ok: true, userId, needsConfirmation: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
