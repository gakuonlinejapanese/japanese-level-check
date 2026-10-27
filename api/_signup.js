import crypto from "crypto";
import { getAdminClient } from "./_supabaseAdmin.js";
import { sendEmail } from "./_resend.js";

const APP_URL = "https://app.seitojapanese.online";

// Used only for OLD accounts that were created before "verify later" and are still unconfirmed
// (they cannot log in until they confirm). New accounts get welcomeHtml below instead.
function confirmationHtml(link) {
  return `
        <h2 style="margin:0 0 16px;">Welcome to GAKU Master!</h2>
        <p>Thank you for signing up. Please confirm your email address by clicking the button below.</p>
        <p style="margin:24px 0;"><a href="${link}" style="background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Confirm my email</a></p>
        <p style="font-size:12px;color:#666;">If the button does not work, copy and paste this link into your browser:<br/>${link}</p>
        <p>If you did not sign up, you can ignore this email.</p>
        <p>Best regards,<br/>Seito — GAKU Online Japanese</p>`;
}

// New accounts can start studying right away; this email just proves the address is theirs.
function welcomeHtml(link) {
  return `
        <h2 style="margin:0 0 16px;">Welcome to GAKU Master!</h2>
        <p>Your account is ready — you can start studying right now. Please tap the button below once to verify this email address, so we can reach you if you ever forget your password.</p>
        <p style="margin:24px 0;"><a href="${link}" style="background:#7c3aed;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Verify my email &amp; open GAKU Master</a></p>
        <p style="font-size:12px;color:#666;">If the button does not work, copy and paste this link into your browser:<br/>${link}</p>
        <p>If you did not sign up, you can ignore this email.</p>
        <p>Best regards,<br/>Seito — GAKU Online Japanese</p>`;
}

// Marks the logged-in account's email as verified. Called by the app when it is opened from the
// link in the welcome email (?vt=<token>). The token lives in app_metadata, which students can
// never edit, so only someone who actually received the email can complete this.
async function handleVerify(req, res, admin) {
  const jwt = String(req.headers?.authorization || "").replace(/^Bearer\s+/i, "").trim();
  const token = String(req.body?.token || "");
  if (!jwt || !token) return res.status(400).json({ error: "Missing token." });
  const { data: u, error: uErr } = await admin.auth.getUser(jwt);
  if (uErr || !u?.user) return res.status(401).json({ error: "Please log in first." });
  const am = u.user.app_metadata || {};
  if (am.email_verified === true) return res.status(200).json({ ok: true, alreadyVerified: true });
  const expected = String(am.verify_token || "");
  const a = Buffer.from(expected), b = Buffer.from(token);
  if (!expected || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return res.status(400).json({ error: "This verification link does not match this account." });
  }
  const { error } = await admin.auth.admin.updateUserById(u.user.id, {
    app_metadata: { ...am, email_verified: true, verify_token: null, email_verified_at: new Date().toISOString() },
  });
  if (error) return res.status(500).json({ error: error.message || "Could not verify." });
  return res.status(200).json({ ok: true, verified: true });
}

// Sign-up that does NOT depend on Supabase's built-in email sender (which is
// rate limited and was set to 0/hour). New accounts are created already usable
// (email_confirm: true) so a student is never stuck waiting for an email that may not
// arrive; ownership of the address is verified later through the link in the welcome
// email we send ourselves via Brevo.
export async function handleSignup(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const admin = getAdminClient();
    if (req.body?.action === "verify") return await handleVerify(req, res, admin);

    const { email: rawEmail, password, resend, pendingForm } = req.body || {};
    const email = String(rawEmail || "").trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    // Keep the QuickStart answers with the ACCOUNT (not just the browser), so a login from another
    // browser / in-app webview still lands the student on their dashboard instead of asking the
    // same questions again.
    const formMeta = () => {
      if (!pendingForm || typeof pendingForm !== "object") return {};
      try { return JSON.stringify(pendingForm).length <= 4000 ? { pending_form: pendingForm } : {}; } catch { return {}; }
    };
    const stashForm = async (userId) => {
      try {
        const meta = formMeta();
        if (!userId || !meta.pending_form) return;
        await admin.auth.admin.updateUserById(userId, { user_metadata: meta });
      } catch (e) { console.error("[signup] stash form failed:", e.message); }
    };
    const sendWelcome = async (token) => {
      try {
        await sendEmail({
          to: email,
          subject: "Welcome to GAKU Master — please verify your email",
          html: welcomeHtml(`${APP_URL}/app?vt=${token}`),
        });
      } catch (e) { console.error("[signup] welcome email failed:", e.message); }
    };

    // Look the account up (without sending anything). Also used to re-send the old-style
    // confirmation for legacy accounts that were created before "verify later" and never confirmed.
    const lookupUser = async () => {
      const { data: ml, error: mlErr } = await admin.auth.admin.generateLink({
        type: "magiclink", email, options: { redirectTo: APP_URL },
      });
      if (mlErr || !ml?.user) return { user: null };
      return { user: ml.user, link: ml.properties?.action_link };
    };
    const resendConfirmation = async () => {
      const { user, link } = await lookupUser();
      if (!user) return { sent: false, confirmed: false, notFound: true };
      if (user.email_confirmed_at) return { sent: false, confirmed: true, userId: user.id };
      if (!link) return { sent: false, confirmed: false };
      await stashForm(user.id);
      await sendEmail({
        to: email,
        subject: "Confirm your GAKU Master account",
        html: confirmationHtml(link),
      });
      return { sent: true, confirmed: false, userId: user.id };
    };
    if (resend) {
      const r = await resendConfirmation();
      return res.status(200).json({ ok: true, resent: r.sent, alreadyConfirmed: r.confirmed });
    }

    if (!password || String(password).length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters." });
    }

    // The Android/iOS store apps bundle their own copy of the web app, so older installs still
    // expect the old behaviour (account created unconfirmed, "check your email" screen, no session).
    // Only clients that send verifyLater: true — the current web app — get the new flow below.
    if (req.body?.verifyLater !== true) {
      const { data: ld, error: lerr } = await admin.auth.admin.generateLink({
        type: "signup", email, password, options: { redirectTo: APP_URL },
      });
      if (lerr) {
        const lmsg = String(lerr.message || "");
        if (lerr.code === "email_exists" || /already (been )?registered|already exists/i.test(lmsg)) {
          const r = await resendConfirmation();
          if (r.sent) return res.status(200).json({ ok: true, userId: r.userId, needsConfirmation: true, resentConfirmation: true });
          return res.status(200).json({ alreadyRegistered: true });
        }
        return res.status(400).json({ error: lmsg || "Could not create account." });
      }
      const llink = ld?.properties?.action_link;
      const luserId = ld?.user?.id;
      if (!llink || !luserId) return res.status(500).json({ error: "Could not create confirmation link." });
      await stashForm(luserId);
      await sendEmail({ to: email, subject: "Confirm your GAKU Master account", html: confirmationHtml(llink) });
      return res.status(200).json({ ok: true, userId: luserId, needsConfirmation: true });
    }

    const verifyToken = crypto.randomBytes(24).toString("hex");
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { email_verified: false, verify_token: verifyToken },
      user_metadata: formMeta(),
    });

    if (error) {
      const msg = String(error.message || "");
      if (error.code === "email_exists" || /already (been )?registered|already exists/i.test(msg)) {
        // An account that was created under the old flow but never confirmed is not a real
        // "already registered" case — the student never got/saw the email. Let them in now: set the
        // password they just chose, make the account usable, and send the verify-later email.
        const { user } = await lookupUser();
        if (user && !user.email_confirmed_at) {
          const { error: upErr } = await admin.auth.admin.updateUserById(user.id, {
            password,
            email_confirm: true,
            app_metadata: { ...(user.app_metadata || {}), email_verified: false, verify_token: verifyToken },
            user_metadata: { ...(user.user_metadata || {}), ...formMeta() },
          });
          if (upErr) return res.status(400).json({ error: upErr.message || "Could not create account." });
          await sendWelcome(verifyToken);
          return res.status(200).json({ ok: true, userId: user.id, needsConfirmation: false });
        }
        return res.status(200).json({ alreadyRegistered: true });
      }
      return res.status(400).json({ error: msg || "Could not create account." });
    }

    const userId = data?.user?.id;
    if (!userId) return res.status(500).json({ error: "Could not create account." });
    await sendWelcome(verifyToken);

    return res.status(200).json({ ok: true, userId, needsConfirmation: false });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
