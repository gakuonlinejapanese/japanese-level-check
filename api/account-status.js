import { getAdminClient } from "./_supabaseAdmin.js";

// Reports everything the client needs to decide whether to show/hide the
// paywall, without the user having to refresh the page:
//   - isGakuStudent: redeemed a valid invite code at signup (free plan)
//   - isPaid: Stripe checkout.session.completed came in for this account
//     (set by api/stripe-webhook.js) and hasn't been reset by a
//     withdrawal/re-init since
//   - suspended / suspendedUntil: temporarily locked out (e.g. the
//     3rd-device sharing-suspicion rule), see api/device-check.js
//
// Replaces the old check-gaku-student.js (same request shape) so existing
// callers only need their response-field expectations updated.
//
// Also enforces the 7-day free trial server-side: 7 days after
// trial_started_at (set once, at signup — see api/create-profile.js), a
// non-paid, non-GAKU-student account would normally be reported as
// trialExpired... except we now grant every such account a one-time bonus
// "Tutorial week" right at that point (tutorial_grace_started_at, stamped
// once and never reset) during which trialExpired stays false and the
// account keeps full access — this is deliberately when the Tutorial
// feature (see GakuApp.jsx TutorialOverlay) auto-launches, so the student
// actually learns the 5 main tabs before being asked to decide on a plan.
// Once that bonus week elapses, trialExpired flips true for good and the
// client hard-locks to the payment screen, no matter which device it opens
// on or how many times the app was uninstalled/reinstalled. A further
// 7-day grace period is given after THAT before we wipe the account's study
// data (assigned_vocab + migration_bridge) — this is deliberately framed to
// the student as "pay within 1 week of hitting the payment screen or your
// data resets" (see trialEndedDesc / PolicyGate copy in GakuApp.jsx), so
// GRACE_DAYS must stay in sync with that "1 week" wording.
// The wipe only ever runs once per account (guarded by data_reset_at).
const TRIAL_DAYS = 7;
const TUTORIAL_GRACE_DAYS = 7; // one-time bonus week granted right when the 7-day trial ends
const GRACE_DAYS = 7; // additional 7 days after the tutorial-grace week ends before data is wiped

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("is_gaku_student, is_paid, paid_plan, suspended_until, trial_started_at, data_reset_at, tutorial_grace_started_at")
      .eq("id", userId)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });

    const suspendedUntil = data?.suspended_until || null;
    const suspended = !!(suspendedUntil && new Date(suspendedUntil) > new Date());
    let isGakuStudent = !!data?.is_gaku_student;
    const isPaid = !!data?.is_paid;

    // Safety net: profiles.is_gaku_student can end up out of sync with reality
    // (e.g. the redeem step failed/raced during signup). A GAKU student must
    // NEVER see the paywall, so before trusting the flag, fall back to
    // checking whether this account's own email matches a registered invite
    // code — and if so, self-heal the profile row so this only has to run once.
    if (!isGakuStudent) {
      const { data: userData } = await supabase.auth.admin.getUserById(userId);
      const userEmail = userData?.user?.email?.trim().toLowerCase();
      if (userEmail) {
        const { data: invites } = await supabase
          .from("invite_codes")
          .select("id")
          .eq("student_email", userEmail)
          .limit(1);
        if (invites && invites.length > 0) {
          isGakuStudent = true;
          await supabase.from("profiles").upsert({ id: userId, is_gaku_student: true });
        }
      }
    }

    const trialStartedAt = data?.trial_started_at ? new Date(data.trial_started_at) : null;
    const daysSinceTrial = trialStartedAt ? (Date.now() - trialStartedAt.getTime()) / 86400000 : null;
    const pastTrial = daysSinceTrial !== null && daysSinceTrial >= TRIAL_DAYS;

    // Grant the one-time bonus "Tutorial week" the first moment an unpaid,
    // non-GAKU account crosses the 7-day mark. Stamped once and never
    // touched again, so re-crossing this check on later polls is a no-op.
    let tutorialGraceStartedAt = data?.tutorial_grace_started_at ? new Date(data.tutorial_grace_started_at) : null;
    if (!isPaid && !isGakuStudent && pastTrial && !tutorialGraceStartedAt) {
      tutorialGraceStartedAt = new Date();
      try {
        await supabase.from("profiles").update({ tutorial_grace_started_at: tutorialGraceStartedAt.toISOString() }).eq("id", userId);
      } catch (grantErr) {
        console.error("[account-status] failed to grant tutorial grace week:", grantErr.message);
      }
    }
    const daysSinceTutorialGrace = tutorialGraceStartedAt ? (Date.now() - tutorialGraceStartedAt.getTime()) / 86400000 : null;
    const inTutorialGraceWeek = daysSinceTutorialGrace !== null && daysSinceTutorialGrace < TUTORIAL_GRACE_DAYS;
    const trialExpired = !isPaid && !isGakuStudent && pastTrial && !inTutorialGraceWeek;
    const daysUntilTrialEnds = daysSinceTrial !== null && !pastTrial ? Math.max(0, Math.ceil(TRIAL_DAYS - daysSinceTrial)) : null;
    // Days left in the bonus Tutorial week (null once it's over/not applicable) —
    // lets the client show a "your bonus week is ending" banner, mirroring the
    // existing daysUntilTrialEnds one for the original 7-day trial.
    const tutorialGraceDaysLeft = inTutorialGraceWeek ? Math.max(0, Math.ceil(TUTORIAL_GRACE_DAYS - daysSinceTutorialGrace)) : null;

    // Daily engagement ping: this endpoint is already polled every ~4s while
    // the app is open, so it doubles as a free "was this account active
    // today" signal. One upsert row per (user, calendar day) — cheap no-op
    // on repeat calls the same day. Used for two things:
    //  1. The daily cron in api/admin-withdrawal.js reads it (filtered to
    //     trial-only accounts there) to spot engaged-but-hasn't-converted
    //     trial students and offer them a free lesson consultation, and to
    //     send re-engagement/trial-ending reminder emails.
    //  2. streakDays below, computed for every account (paid/GAKU included)
    //     so the dashboard can show a consecutive-day streak to everyone,
    //     not just trial students.
    // Previously gated to trial-only accounts; now pings for every account
    // that has a trial_started_at (i.e. every account, since that's set at
    // signup for everyone) so the streak feature works app-wide.
    if (trialStartedAt) {
      const today = new Date().toISOString().slice(0, 10);
      try {
        const { error: pingErr } = await supabase
          .from("trial_engagement_days")
          .upsert(
            { user_id: userId, day: today, last_ping_at: new Date().toISOString() },
            { onConflict: "user_id,day" }
          );
        if (pingErr) console.error("[account-status] engagement ping failed:", pingErr.message);
      } catch (pingErr) {
        console.error("[account-status] engagement ping threw:", pingErr.message);
      }
    }

    // Consecutive-day streak (today or yesterday counts as "current", so a
    // student who hasn't opened the app yet today doesn't see their streak
    // reset to 0 the moment midnight passes). Looks back at most 60 days.
    let streakDays = 0;
    try {
      const { data: recentDays } = await supabase
        .from("trial_engagement_days")
        .select("day")
        .eq("user_id", userId)
        .order("day", { ascending: false })
        .limit(60);
      const daySet = new Set((recentDays || []).map(r => r.day));
      const cursor = new Date();
      // If today has no ping yet, start counting from yesterday instead —
      // otherwise a student who is about to open the app right now would
      // briefly see yesterday's streak drop to 0 first.
      if (!daySet.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
      while (daySet.has(cursor.toISOString().slice(0, 10))) {
        streakDays += 1;
        cursor.setDate(cursor.getDate() - 1);
      }
    } catch (streakErr) {
      console.error("[account-status] streak calculation failed:", streakErr.message);
    }

    let dataWasReset = false;
    // Wipe once GRACE_DAYS have passed since the payment screen actually
    // started showing (i.e. since the bonus Tutorial week ended) — not since
    // the original trial_started_at, since that bonus week pushes the real
    // lock point out by TUTORIAL_GRACE_DAYS. Falls back to the old trial-only
    // math for the rare case tutorial_grace_started_at never got stamped.
    const effectiveLockAt = tutorialGraceStartedAt
      ? new Date(tutorialGraceStartedAt.getTime() + TUTORIAL_GRACE_DAYS * 86400000)
      : (trialStartedAt ? new Date(trialStartedAt.getTime() + TRIAL_DAYS * 86400000) : null);
    const daysSinceLocked = effectiveLockAt ? (Date.now() - effectiveLockAt.getTime()) / 86400000 : null;
    if (!isPaid && !isGakuStudent && !data?.data_reset_at && daysSinceLocked !== null && daysSinceLocked >= GRACE_DAYS) {
      try {
        await supabase.from("assigned_vocab").delete().eq("student_id", userId);
        await supabase.from("migration_bridge").delete().eq("user_id", userId);
        await supabase.from("profiles").update({ data_reset_at: new Date().toISOString() }).eq("id", userId);
        dataWasReset = true;
      } catch (wipeErr) {
        console.error("Trial data-reset wipe failed:", wipeErr.message);
      }
    }

    return res.status(200).json({
      isGakuStudent,
      isPaid,
      paidPlan: data?.paid_plan || null,
      suspended,
      suspendedUntil,
      trialExpired,
      daysUntilTrialEnds,
      tutorialGraceDaysLeft,
      dataWasReset,
      streakDays,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
