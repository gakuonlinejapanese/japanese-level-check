import { getAdminClient } from "./_supabaseAdmin.js";

// Reverses a pending withdrawal (e.g. teacher misclick, or the student's
// situation changed) as long as the scheduled deletion hasn't run yet.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { secret, studentEmail } = req.body || {};
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!studentEmail) return res.status(400).json({ error: "studentEmail is required" });

    const email = studentEmail.trim().toLowerCase();
    const supabase = getAdminClient();
    const { data: profile, error: findError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("email", email)
      .maybeSingle();
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
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
