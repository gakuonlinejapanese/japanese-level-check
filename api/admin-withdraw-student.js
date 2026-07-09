import { getAdminClient } from "./_supabaseAdmin.js";

// Marks a student as withdrawn (退学). This is a manual, teacher-triggered
// action — it does NOT try to auto-detect withdrawal conditions (those are
// still judged by the teacher using the existing Google Form records).
//
// What this endpoint does automatically once the teacher confirms:
//  1. Revokes paid access immediately (is_gaku_student = false)
//  2. Records the withdrawal date and a scheduled deletion date
//     (now + graceDays, default 14)
//
// It does NOT touch Stripe — there is currently no live Stripe subscription
// integration in this project (payments go through static Stripe Payment
// Links), so cancelling/downgrading the student's Stripe plan must still be
// done manually in the Stripe Dashboard.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { secret, studentEmail, graceDays, reason } = req.body || {};
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!studentEmail) return res.status(400).json({ error: "studentEmail is required" });

    const days = Number.isFinite(Number(graceDays)) && Number(graceDays) > 0 ? Number(graceDays) : 14;
    const email = studentEmail.trim().toLowerCase();

    const supabase = getAdminClient();
    const { data: profile, error: findError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();
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
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
