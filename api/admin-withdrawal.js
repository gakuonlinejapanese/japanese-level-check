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
// GET with header Authorization: Bearer CRON_SECRET — run the daily deletion job (used by vercel.json cron)

async function handleWithdraw(supabase, body, res) {
  const { studentEmail, graceDays, reason } = body;
  if (!studentEmail) return res.status(400).json({ error: "studentEmail is required" });

  const days = Number.isFinite(Number(graceDays)) && Number(graceDays) >= 0 ? Number(graceDays) : 14;
  const email = studentEmail.trim().toLowerCase();

  const { data: profile, error: findError } = await supabase
    .from("profiles").select("id, email").eq("email", email).maybeSingle();
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

  // GAKU students (verified via a redeemed invite code) keep their data —
  // as long as they still have their email/password/invite code they can
  // simply log back in and everything is exactly as they left it.
  if (profile?.is_gaku_student) {
    return res.status(200).json({ ok: true, dataRetained: true });
  }

  // Everyone else (regular paying students, or no profile row at all): wipe
  // everything unconditionally, including payment status — re-signing up
  // starts completely fresh and requires paying again.
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

// Runs once a day as part of the existing cron (piggybacking so we don't
// need a 13th serverless function — Vercel Hobby caps at 12).
//
// Looks at trial accounts (not paid, not GAKU students) whose 7-day trial
// started 3–6 days ago and who haven't been emailed about this yet. If
// api/account-status.js has recorded them as "active" (logged in / had the
// app open) on 2+ distinct days, they're a good candidate: interested and
// using the app, just hasn't converted — so we offer a free 15-min lesson
// consultation instead of just letting the trial silently expire.
//
// Deliberately does NOT touch accounts outside the 3–6 day window (younger
// accounts haven't had enough time to show a pattern yet; older ones are
// about to hit trialExpired anyway via api/account-status.js).
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

// ─── Learning-engagement strategy: two more staged reminder emails ────────
// Together with handleTrialEngagementCheck (day 3–6, 2+ engaged days —
// "you're clearly using it, want a free lesson?") these give trial students
// a 3-touch cadence: Day 2 nudge → Day 3–6 lesson offer (if engaged) →
// Day 6 heads-up. Each guarded by its own *_sent_at column so it only ever
// fires once per account. All three piggyback on the same daily cron slot
// (Vercel Hobby plan caps serverless functions at 12).

// Day-2 "continue where you left off" nudge — specifically for the students
// who are NOT already covered by the day 3–6 lesson-offer email: those who
// opened the app on fewer than 2 distinct days. This is the biggest group
// (roughly 80% of trial signups use the app exactly once and never return),
// and until now nothing ever reached them again after their first session.
const LOW_ENGAGEMENT_WINDOW_MIN_DAYS = 2;
const LOW_ENGAGEMENT_WINDOW_MAX_DAYS = 3;
const LOW_ENGAGEMENT_ACTIVE_DAYS_THRESHOLD = 2; // fewer than this = "low engagement"
const APP_URL = "https://app.seitojapanese.online/app";

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

// Day-6 "your trial is ending soon" heads-up — sent to every non-paid,
// non-GAKU-student account regardless of engagement level, one day before
// api/account-status.js starts reporting trialExpired=true. Softens what
// would otherwise be a sudden, unannounced paywall on day 7.
const TRIAL_ENDING_WARNING_DAY = 6; // trial_started_at this many days ago

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

  // Vercel Cron hits this with GET + the CRON_SECRET bearer token.
  if (req.method === "GET") {
    const authHeader = req.headers.authorization || "";
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      // Four independent daily jobs share this one cron slot (Vercel Hobby
      // caps serverless functions at 12) — run them together, let any one
      // fail without blocking the others, then respond once.
      const [deleteResult, engagementResult, lowEngagementResult, trialEndingResult] = await Promise.all([
        runCronDelete(supabase).catch((e) => ({ ok: false, error: e.message })),
        handleTrialEngagementCheck(supabase).catch((e) => ({ error: e.message })),
        handleLowEngagementReminder(supabase).catch((e) => ({ error: e.message })),
        handleTrialEndingWarning(supabase).catch((e) => ({ error: e.message })),
      ]);
      return res.status(200).json({
        ...deleteResult,
        trialEngagement: engagementResult,
        lowEngagementReminder: lowEngagementResult,
        trialEndingWarning: trialEndingResult,
      });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body || {};
    const { secret, action } = body;

    // Self-service deletion is authenticated via the student's own Supabase
    // session token (checked inside handleSelfDelete), not the admin secret.
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
