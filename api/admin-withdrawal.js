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
  if (findError) return res.status(500).json({ error:
