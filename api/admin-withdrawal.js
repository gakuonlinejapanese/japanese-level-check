import { getAdminClient } from "./_supabaseAdmin.js";
import { sendEmail } from "./_resend.js";

// Consolidates what used to be 4 separate serverless functions
// (admin-withdraw-student, admin-cancel-withdrawal, admin-list-withdrawn,
// cron-delete-withdrawn) into one file, because the Vercel Hobby plan caps
// deployments at 12 serverless functions.
//
// POST { secret, action: "withdraw", studentEmail, graceDays, reason } — mark a student withdrawn
// POST { secret, action: "cancel", studentEmail } — undo a pending withdrawal
// POST { secret, action: "list" } — list students pending deletion
// POST { secret, action: "test_mark_paid", studentEmail } — testing only: mark a
//   profile as paid without a real Stripe payment, so the delete/reset flow can
//   be verified end-to-end without spending money
// POST { action: "self_delete" } + header Authorization: Bearer <student's supabase access token>
//   — student-initiated "delete my account" (also covers "uninstalled the app"):
//   full unconditional wipe for a normal paying student (including payment
//   status, so re-signing up requires paying again); a no-op for a
//   confirmed GAKU student, whose data is kept intact
// GET with header Authorization: Bearer CRON_SECRET — run the daily deletion job (used by
//   vercel.json cron); this also piggybacks the engagement/reminder emails, including
//   handleUnpaidCheckoutReminder (nudges students who agreed to the policy but never
//   completed Stripe checkout — see comment above that function)

const APP_URL = "https://app.seitojapanese.online/app";

// Sent to a student the moment a teacher runs a withdrawal in
// public/admin-withdrawal.html. Separate from the trial-related reminder
// emails further down this file — this one is for students who WERE a
// confirmed GAKU (invitation-code) student and no longer are, so unlike a
// trial student they may not otherwise expect a paywall to appear next time
// they log in.
async function handleWithdraw(supabase, body, res) {
  const { studentEmail, graceDays, reason } = body;
  if (!studentEmail) return res.status(400).json({ error: "studentEmail is required" });

  const days = Number.isFinite(Number(graceDays)) && Number(graceDays) >= 0 ? Number(graceDays) : 14;
  const email = studentEmail.trim().toLowerCase();

  const { data: profile, error: findError } = await supabase
    .from("profiles").select("id, email, name").eq("email", email).maybeSingle();
  if (findError) return res.status(500).json({ error: findError.message });
  if (!profile) return res.status(404).json({ error: "Student not found" });

  const now = new Date();
  const scheduledDeletion = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      is_gaku_student: false,
      enrollment_status: "withdrawn",
      withdrawal_date: now.toISOString(),
      withdrawal_reason: reason || null,
      scheduled_deletion_date: scheduledDeletion.toISOString(),
    })
    .eq("id", profile.id);
  if (updateError) return res.status(500).json({ error: updateError.message });

  // IMPORTANT: api/account-status.js has a self-heal safety net that
  // re-sets is_gaku_student back to true if this email still has a
  // matching row in invite_codes (it exists to fix profiles that got out
  // of sync during signup). Without removing it here, the withdrawal
  // above would be silently undone the next time the app polls
  // account-status.js (roughly every 4 seconds).
  const { error: inviteError } = await supabase
    .from("invite_codes")
    .delete()
    .eq("student_email", email);
  if (inviteError) {
    console.error(`[admin-withdrawal] failed to remove invite_codes for ${email}:`, inviteError.message);
  }

  const graceDaysLabel = days === 1 ? "1 day" : `${days} days`;
  const dateStr = scheduledDeletion.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const name = profile.name || "";

  const html = `
    <p>Hi${name ? ` ${name}` : ""},</p>
    <p>This is to let you know that you are no longer an official GAKU student.</p>
    <p>Your GAKU Master account and everything you've studied so far are still there. Please decide whether you'd like to keep your account and study content. If you'd like to continue using GAKU Master, you'll need to sign up for one of our paid plans.</p>
    <p><a href="${APP_URL}?preview=paywall" style="color:#a855f7">View plans →</a></p>
    <p>If we don't hear from you, your account will be permanently deleted in ${graceDaysLabel} (${dateStr}).</p>
    <p>If you have any questions, feel free to reach out.</p>
    <p>— Seito</p>
  `;

  try {
    await sendEmail({
      to: email,
      subject: "Your GAKU enrollment status has changed",
      html,
    });
  } catch (emailErr) {
    console.error(`[admin-withdrawal] failed to send withdrawal email to ${email}:`, emailErr.message);
  }

  return res.status(200).json({
    ok: true,
    scheduledDeletionDate: scheduledDeletion.toISOString(),
    reminder: "Stripe側の解約/プラン変更は自動化されていません。Stripeダッシュボードで手動対応してください。",
  });
}

async function handleCancel(supabase, body, res) {
  const { studentEmail } = body;
  if (!studentEmail) return res.status(400).json({ error: "studentEmail is required" });
  const email = studentEmail.trim().toLowerCase();

  const { data: profile, error: findError } = await supabase
    .from("profiles").select("id, email").eq("email", email).maybeSingle();
  if (findError) return res.status(500).json({ error: findError.message });
  if (!profile) return res.status(404).json({ error: "Student not found" });

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      is_gaku_student: true,
      enrollment_status: "active",
      withdrawal_date: null,
      withdrawal_reason: null,
      scheduled_deletion_date: null,
    })
    .eq("id", profile.id);
  if (updateError) return res.status(500).json({ error: updateError.message });

  return res.status(200).json({ ok: true });
}

async function handleList(supabase, res) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, withdrawal_date, withdrawal_reason, scheduled_deletion_date")
    .eq("enrollment_status", "withdrawn")
    .order("scheduled_deletion_date", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ students: data || [] });
}

async function runCronDelete(supabase) {
  const nowIso = new Date().toISOString();
  const { data: due, error: findError } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("enrollment_status", "withdrawn")
    .lte("scheduled_deletion_date", nowIso);
  if (findError) throw new Error(findError.message);

  const results = [];
  for (const profile of due || []) {
    try {
      await supabase.from("assigned_vocab").delete().eq("student_id", profile.id);
      await supabase.from("device_approval_requests").delete().eq("user_id", profile.id);
      await supabase.from("profiles").delete().eq("id", profile.id);
      await supabase.auth.admin.deleteUser(profile.id);
      results.push({ email: profile.email, deleted: true });
    } catch (innerErr) {
      results.push({ email: profile.email, deleted: false, error: innerErr.message });
    }
  }
  return { ok: true, processed: results.length, results };
}

async function handleSelfDelete(supabase, req, res) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing access token" });

  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userData?.user) return res.status(401).json({ error: "Invalid or expired session" });
  const userId = userData.user.id;

  const { data: profile, error: findError } = await supabase
    .from("profiles").select("id, is_gaku_student").eq("id", userId).maybeSingle();
  if (findError) return res.status(500).json({ error: findError.message });

  if (profile?.is_gaku_student) {
    return res.status(200).json({ ok: true, dataRetained: true });
  }

  try {
    await supabase.from("assigned_vocab").delete().eq("student_id", userId);
    await supabase.from("device_sessions").delete().eq("user_id", userId);
    await supabase.from("device_approval_requests").delete().eq("user_id", userId);
    await supabase.from("profiles").delete().eq("id", userId);
    await supabase.auth.admin.deleteUser(userId);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
  return res.status(200).json({ ok: true, dataRetained: false });
}

const ENGAGEMENT_WINDOW_MIN_DAYS = 3;
const ENGAGEMENT_WINDOW_MAX_DAYS = 6;
const ENGAGEMENT_ACTIVE_DAYS_THRESHOLD = 2;
const BOOK_LESSON_URL = "https://app.seitojapanese.online/book-lesson.html";

async function handleTrialEngagementCheck(supabase) {
  const now = Date.now();
  const windowStartIso = new Date(now - ENGAGEMENT_WINDOW_MAX_DAYS * 86400000).toISOString();
  const windowEndIso = new Date(now - ENGAGEMENT_WINDOW_MIN_DAYS * 86400000).toISOString();

  const { data: candidates, error: candidatesErr } = await supabase
    .from("profiles")
    .select("id, email, trial_started_at")
    .eq("is_paid", false)
    .eq("is_gaku_student", false)
    .is("trial_engagement_notified_at", null)
    .gte("trial_started_at", windowStartIso)
    .lte("trial_started_at", windowEndIso);

  if (candidatesErr) return { checked: 0, notified: 0, error: candidatesErr.message };

  let notified = 0;
  for (const profile of candidates || []) {
    if (!profile.email) continue;
    try {
      const { count, error: countErr } = await supabase
        .from("trial_engagement_days")
        .select("day", { count: "exact", head: true })
        .eq("user_id", profile.id);
      if (countErr || (count || 0) < ENGAGEMENT_ACTIVE_DAYS_THRESHOLD) continue;

      const html = `
        <p>Hi,</p>
        <p>I noticed you've been using GAKU Master to study Japanese this week — that's great!</p>
        <p>If you'd like, I'd be happy to offer you a free 15-minute 1-on-1 consultation to answer any questions and see if a lesson would help you reach your goals faster.</p>
        <p><a href="${BOOK_LESSON_URL}" style="color:#a855f7">Book your free 15-minute consultation →</a></p>
        <p>No pressure at all — keep enjoying GAKU Master either way!</p>
        <p>— Seito</p>
      `;
      await sendEmail({ to: profile.email, subject: "Loving GAKU Master so far? Let's talk 1-on-1 (free 15 min)", html });
      await supabase.from("profiles").update({ trial_engagement_notified_at: new Date().toISOString() }).eq("id", profile.id);
      notified += 1;
    } catch (innerErr) {
      console.error(`[trial-engagement] failed for ${profile.email}:`, innerErr.message);
    }
  }

  return { checked: (candidates || []).length, notified };
}

const LOW_ENGAGEMENT_WINDOW_MIN_DAYS = 2;
const LOW_ENGAGEMENT_WINDOW_MAX_DAYS = 3;
const LOW_ENGAGEMENT_ACTIVE_DAYS_THRESHOLD = 2;

async function handleLowEngagementReminder(supabase) {
  const now = Date.now();
  const windowStartIso = new Date(now - LOW_ENGAGEMENT_WINDOW_MAX_DAYS * 86400000).toISOString();
  const windowEndIso = new Date(now - LOW_ENGAGEMENT_WINDOW_MIN_DAYS * 86400000).toISOString();

  const { data: candidates, error: candidatesErr } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("is_paid", false)
    .eq("is_gaku_student", false)
    .is("low_engagement_reminder_sent_at", null)
    .gte("trial_started_at", windowStartIso)
    .lte("trial_started_at", windowEndIso);

  if (candidatesErr) return { checked: 0, notified: 0, error: candidatesErr.message };

  let notified = 0;
  for (const profile of candidates || []) {
    if (!profile.email) continue;
    try {
      const { count, error: countErr } = await supabase
        .from("trial_engagement_days")
        .select("day", { count: "exact", head: true })
        .eq("user_id", profile.id);
      if (countErr || (count || 0) >= LOW_ENGAGEMENT_ACTIVE_DAYS_THRESHOLD) continue;

      const html = `
        <p>Hi,</p>
        <p>You started your Japanese study plan on GAKU Master a couple of days ago — nice start! Life gets busy, so this is just a friendly nudge to pick up right where you left off.</p>
        <p>Your plan, vocabulary, and progress are all still waiting for you.</p>
        <p><a href="${APP_URL}" style="color:#a855f7">Continue studying →</a></p>
        <p>Even 5 minutes today keeps the momentum going!</p>
        <p>— Seito</p>
      `;
      await sendEmail({ to: profile.email, subject: "Your Japanese study plan is still here 🇯🇵", html });
      await supabase.from("profiles").update({ low_engagement_reminder_sent_at: new Date().toISOString() }).eq("id", profile.id);
      notified += 1;
    } catch (innerErr) {
      console.error(`[low-engagement] failed for ${profile.email}:`, innerErr.message);
    }
  }

  return { checked: (candidates || []).length, notified };
}

const TRIAL_ENDING_WARNING_DAY = 6;

async function handleTrialEndingWarning(supabase) {
  const now = Date.now();
  const dayStartIso = new Date(now - (TRIAL_ENDING_WARNING_DAY + 1) * 86400000).toISOString();
  const dayEndIso = new Date(now - TRIAL_ENDING_WARNING_DAY * 86400000).toISOString();

  const { data: candidates, error: candidatesErr } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("is_paid", false)
    .eq("is_gaku_student", false)
    .is("trial_ending_warning_sent_at", null)
    .gte("trial_started_at", dayStartIso)
    .lte("trial_started_at", dayEndIso);

  if (candidatesErr) return { checked: 0, notified: 0, error: candidatesErr.message };

  let notified = 0;
  for (const profile of candidates || []) {
    if (!profile.email) continue;
    try {
      const html = `
        <p>Hi,</p>
        <p>Just a heads-up: your free 7-day trial of GAKU Master ends tomorrow.</p>
        <p>After that, you'll need to choose a plan to keep studying — but don't worry, nothing is deleted right away, so you'll have a few extra days to decide.</p>
        <p><a href="${APP_URL}?preview=paywall" style="color:#a855f7">View plans →</a></p>
        <p>Thank you for trying GAKU Master this week!</p>
        <p>— Seito</p>
      `;
      await sendEmail({ to: profile.email, subject: "Your GAKU Master free trial ends tomorrow", html });
      await supabase.from("profiles").update({ trial_ending_warning_sent_at: new Date().toISOString() }).eq("id", profile.id);
      notified += 1;
    } catch (innerErr) {
      console.error(`[trial-ending] failed for ${profile.email}:`, innerErr.message);
    }
  }

  return { checked: (candidates || []).length, notified };
}

const UNPAID_REMINDER_MIN_AGE_MS = 60 * 60 * 1000;
const UNPAID_REMINDER_MAX_AGE_MS = 48 * 60 * 60 * 1000;
const PLAN_STRIPE_LINKS = {
  "App Only - Monthly ($14.99)": "https://buy.stripe.com/6oU7sL7qWg7C7wV1OqbMQ00",
  "App Only - 3 Months ($42.70)": "https://buy.stripe.com/28E28r9z46x2dVj0KmbMQ02",
  "App Only - 6 Months ($80.95)": "https://buy.stripe.com/28E5kD8v07B6bNbct4bMQ03",
};

async function handleUnpaidCheckoutReminder(supabase) {
  const now = Date.now();
  const windowStartIso = new Date(now - UNPAID_REMINDER_MAX_AGE_MS).toISOString();
  const windowEndIso = new Date(now - UNPAID_REMINDER_MIN_AGE_MS).toISOString();

  const { data: candidates, error: candidatesErr } = await supabase
    .from("policy_agreements")
    .select("id, user_id, email, name, plan, agreed_at")
    .is("reminder_sent_at", null)
    .not("user_id", "is", null)
    .in("plan", Object.keys(PLAN_STRIPE_LINKS))
    .gte("agreed_at", windowStartIso)
    .lte("agreed_at", windowEndIso);

  if (candidatesErr) return { checked: 0, notified: 0, error: candidatesErr.message };

  let notified = 0;
  for (const row of candidates || []) {
    if (!row.email || !row.user_id) continue;
    try {
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("is_paid, is_gaku_student")
        .eq("id", row.user_id)
        .maybeSingle();
      if (profileErr) throw profileErr;
      if (profile?.is_paid || profile?.is_gaku_student) {
        await supabase.from("policy_agreements").update({ reminder_sent_at: new Date().toISOString() }).eq("id", row.id);
        continue;
      }

      const baseUrl = PLAN_STRIPE_LINKS[row.plan];
      const checkoutUrl = new URL(baseUrl);
      checkoutUrl.searchParams.set("client_reference_id", row.user_id);
      checkoutUrl.searchParams.set("prefilled_email", row.email);

      const html = `
        <p>Hi${row.name ? ` ${row.name}` : ""},</p>
        <p>It looks like your GAKU Master purchase (${row.plan}) wasn't completed.</p>
        <p><a href="${checkoutUrl.toString()}" style="color:#a855f7">Complete your purchase →</a></p>
        <p>— Seito</p>
      `;
      await sendEmail({ to: row.email, subject: "Your GAKU Master purchase wasn't completed", html });
      await supabase.from("policy_agreements").update({ reminder_sent_at: new Date().toISOString() }).eq("id", row.id);
      notified += 1;
    } catch (innerErr) {
      console.error(`[unpaid-checkout-reminder] failed for ${row.email}:`, innerErr.message);
    }
  }

  return { checked: (candidates || []).length, notified };
}

async function handleTestMarkPaid(supabase, body, res) {
  const { studentEmail } = body;
  if (!studentEmail) return res.status(400).json({ error: "studentEmail is required" });
  const email = studentEmail.trim().toLowerCase();

  const { data: profile, error: findError } = await supabase
    .from("profiles").select("id, email").eq("email", email).maybeSingle();
  if (findError) return res.status(500).json({ error: findError.message });
  if (!profile) return res.status(404).json({ error: "No profile found for that email. Log in / sign up with this account in the app at least once first." });

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ is_paid: true, paid_plan: "TEST (no real payment)", paid_at: new Date().toISOString() })
    .eq("id", profile.id);
  if (updateError) return res.status(500).json({ error: updateError.message });

  return res.status(200).json({ ok: true });
}

export default async function handler(req, res) {
  const supabase = getAdminClient();

  if (req.method === "GET") {
    const authHeader = req.headers.authorization || "";
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const [deleteResult, engagementResult, lowEngagementResult, trialEndingResult, unpaidReminderResult] = await Promise.all([
        runCronDelete(supabase).catch((e) => ({ ok: false, error: e.message })),
        handleTrialEngagementCheck(supabase).catch((e) => ({ error: e.message })),
        handleLowEngagementReminder(supabase).catch((e) => ({ error: e.message })),
        handleTrialEndingWarning(supabase).catch((e) => ({ error: e.message })),
        handleUnpaidCheckoutReminder(supabase).catch((e) => ({ error: e.message })),
      ]);
      return res.status(200).json({
        ...deleteResult,
        trialEngagement: engagementResult,
        lowEngagementReminder: lowEngagementResult,
        trialEndingWarning: trialEndingResult,
        unpaidCheckoutReminder: unpaidReminderResult,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body || {};
    const { secret, action } = body;

    if (action === "self_delete") return await handleSelfDelete(supabase, req, res);

    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (action === "withdraw") return await handleWithdraw(supabase, body, res);
    if (action === "cancel") return await handleCancel(supabase, body, res);
    if (action === "list") return await handleList(supabase, res);
    if (action === "test_mark_paid") return await handleTestMarkPaid(supabase, body, res);
    return res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
