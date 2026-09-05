import { getAdminClient } from "./_supabaseAdmin.js";
import { sendEmail } from "./_resend.js";

const APP_URL = "https://app.seitojapanese.online";
const GAKU_READER_URL = "https://chromewebstore.google.com/detail/eambfoiipilfnedcofindninaachibge";
const DEMO_IMG = `${APP_URL}/gaku-reader-demo.png`;
const LOGO_IMG = `${APP_URL}/gaku-logo-circle.png`;

// Sent once, only on a genuine first-ever signup (see isFirstTrialGrant &&
// !priorTrialAt below) — introduces the GAKU Reader Chrome extension and
// explains the 7-day free trial. Never re-sent on a trial-abuse re-signup
// (deleted account + re-registering), since that student already got it.
function buildWelcomeEmailHtml() {
  return `
    <h2 style="margin:0 0 16px;">A New Tool for You — GAKU Reader (Chrome Extension)</h2>
    <p>Hi,</p>
    <p>This is Seito, the creator of Online Japanese Tutor GAKU and GAKU Master.</p>
    <p>I'm excited to share something new with you: <strong>GAKU Reader</strong>, a Chrome extension I built to make your Japanese reading practice a little easier and a lot more fun.</p>
    <p><img src="${DEMO_IMG}" alt="GAKU Reader in action" style="max-width:600px;width:100%;height:auto;display:block;border-radius:8px;" /></p>
    <p>With GAKU Reader, whenever you're reading something in Japanese online, you can just click on a word or sentence to get:</p>
    <ul>
      <li>Instant translation</li>
      <li>Grammar explanations</li>
      <li>Pronunciation</li>
      <li>Real example sentences</li>
      <li>Furigana and Romaji display</li>
    </ul>
    <p>The idea came from watching so many of you struggle with looking up unfamiliar words while reading — I wanted to make that process as smooth as possible so you can focus on actually enjoying what you're reading, whether it's news, blogs, or anything else.</p>
    <p>Getting started is super easy:<br/>Just open the link below and click "Add to Chrome."</p>
    <p><a href="${GAKU_READER_URL}" style="color:#06b6d4;">${GAKU_READER_URL}</a></p>
    <p>Once it's added, you'll find it right there in your toolbar, ready whenever you need it.</p>
    <p>If you run into any trouble or have questions about how to use it, don't hesitate to reach out — I'm always happy to help.</p>
    <p>Looking forward to seeing how it helps your studies!</p>
    <br/>
    <p>Thank you very much for downloading GAKU Master and creating your study plan.</p>
    <p>I would like to clarify that creating your study plan is completely free, and you will not be charged anything during the first seven days. You can use GAKU Master free of charge during this seven-day trial period.</p>
    <p>After the seven-day free trial, you will have two options:</p>
    <ol>
      <li>Become an Official GAKU Student and continue using GAKU Master for free, or</li>
      <li>Choose a paid plan if you would like to continue using GAKU Master without becoming an Official GAKU Student.</li>
    </ol>
    <p>If, after the seven-day trial, you decide that you do not want to pay for the app or take lessons, that is completely fine. You can simply stop using the app or delete it, and you will not be charged.</p>
    <p>If you decide to choose a paid plan, please make sure to review the pricing and plan details before completing your payment.</p>
    <p>For now, please enjoy your seven-day free trial of GAKU Master with no payment required.</p>
    <p>Once again, I sincerely apologize for any confusion, and I hope you enjoy using GAKU Master.</p>
    <p>Best regards,<br/>Seito</p>
    <br/>
    <p>Best regards,<br/>If you have any questions or concerns, feel free to contact me.</p>
    <p><strong>More information about GAKU</strong></p>
    <p>
      Website: <a href="https://www.seitojapanese.online" style="color:#06b6d4;">https://www.seitojapanese.online</a><br/>
      Google business page: <a href="https://g.co/kgs/TzBMwyU" style="color:#06b6d4;">https://g.co/kgs/TzBMwyU</a><br/>
      Gmail: <a href="mailto:seitojapanese.online@gmail.com" style="color:#06b6d4;">seitojapanese.online@gmail.com</a><br/>
      Phone: +81 80 2510 5951<br/>
      Facebook: <a href="https://www.facebook.com/profile.php?id=61564825647440" style="color:#06b6d4;">https://www.facebook.com/profile.php?id=61564825647440</a><br/>
      Instagram: <a href="https://www.instagram.com/seitojapanese.online/" style="color:#06b6d4;">https://www.instagram.com/seitojapanese.online/</a><br/>
      Amazing Talker: <a href="https://en.amazingtalker.com/blog/en/other/116528/" style="color:#06b6d4;">https://en.amazingtalker.com/blog/en/other/116528/</a>
    </p>
    <p>Best regards,<br/>Seito Sakamoto, MA in Teaching International Language, a Japanese tutor from GAKU.</p>
    <p><img src="${LOGO_IMG}" alt="GAKU logo" style="width:160px;height:auto;display:block;margin-top:12px;" /></p>
  `;
}

// Creates/updates a student's profile row right after signup. Uses the admin
// client so this always succeeds regardless of the profiles table's RLS
// policies (the previous client-side upsert could fail silently if RLS
// blocked the write, leaving the profiles table without a row at all).
//
// Anti-retrial-abuse: the `trial_history` table is a permanent fingerprint
// log (by email AND by device id) that survives self_delete/account-deletion
// (see api/admin-withdrawal.js — it never touches trial_history). If either
// this email or this device already appears there, this is a *returning*
// account trying to get a fresh 7-day trial by deleting and re-signing up —
// so instead of starting a brand-new trial, trial_started_at is backdated
// past the 7-day mark. api/account-status.js then reports trialExpired=true
// on the very next check, and the student sees the payment screen right away
// instead of another free week. A ~2-day buffer is kept before the 10-day
// data-reset cutoff so a fast payment right after signup isn't punished.
const TRIAL_DAYS = 7;
const BACKDATE_DAYS = TRIAL_DAYS + 1; // just past the trial cutoff, safely under the 10-day wipe cutoff

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { userId, email, isGakuStudent, deviceId } = req.body || {};
    if (!userId || !email) return res.status(400).json({ error: "userId and email are required" });
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedDeviceId = (deviceId || "").trim() || null;

    const supabase = getAdminClient();

    // trial_started_at marks the very first time this account was created —
    // used by api/account-status.js to enforce the 7-day free trial /
    // 10-day data-reset window server-side (so it can't be reset just by
    // uninstalling/reinstalling the app). Only set it if this account
    // doesn't already have one, so a retried signup call never pushes it
    // forward and grants extra free days.
    const { data: existing } = await supabase
      .from("profiles")
      .select("trial_started_at")
      .eq("id", userId)
      .maybeSingle();

    const payload = { id: userId, email: normalizedEmail, is_gaku_student: !!isGakuStudent };
    const isFirstTrialGrant = !existing?.trial_started_at;
    let priorTrialAt = null;

    if (isFirstTrialGrant) {
      const orParts = [`email.eq.${normalizedEmail}`];
      if (normalizedDeviceId) orParts.push(`device_id.eq.${normalizedDeviceId}`);
      const { data: priorRows } = await supabase
        .from("trial_history")
        .select("first_trial_started_at")
        .or(orParts.join(","))
        .order("first_trial_started_at", { ascending: true })
        .limit(1);
      priorTrialAt = priorRows?.[0]?.first_trial_started_at || null;

      payload.trial_started_at = priorTrialAt
        ? new Date(Date.now() - BACKDATE_DAYS * 86400000).toISOString()
        : new Date().toISOString();
    }

    const { error } = await supabase.from("profiles").upsert(payload);
    if (error) return res.status(500).json({ error: error.message });

    // Welcome email (GAKU Reader intro + 7-day trial explanation), sent only
    // on a genuine brand-new signup — never on a trial-abuse re-signup, since
    // that email/device already received it the first time around.
    if (isFirstTrialGrant && !priorTrialAt) {
      try {
        await sendEmail({
          to: normalizedEmail,
          subject: "A New Tool for You — GAKU Reader (Chrome Extension)",
          html: buildWelcomeEmailHtml(),
        });
      } catch (emailErr) {
        console.error("[create-profile] welcome email failed:", emailErr.message);
      }
    }

    // Record this email/device fingerprint permanently (once per signup),
    // so a future account deletion + re-signup with either the same email
    // or the same device is caught even though the profiles row is gone.
    if (isFirstTrialGrant) {
      try {
        await supabase.from("trial_history").insert({
          email: normalizedEmail,
          device_id: normalizedDeviceId,
          first_trial_started_at: priorTrialAt || payload.trial_started_at,
        });
      } catch (logErr) {
        console.error("[create-profile] trial_history insert failed:", logErr.message);
      }
    }

    return res.status(200).json({ ok: true, reusedTrial: !!priorTrialAt });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
