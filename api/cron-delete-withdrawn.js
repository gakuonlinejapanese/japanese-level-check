import { getAdminClient } from "./_supabaseAdmin.js";

// Runs once a day (see vercel.json "crons"). Finds every profile whose
// scheduled_deletion_date has passed and permanently deletes:
//   - their assigned_vocab rows
//   - their device_approval_requests rows
//   - their profiles row
//   - their Supabase Auth user (login is fully removed)
//
// Note: this cannot touch anything stored in the student's own browser
// localStorage (their vocab folders, flashcard progress, etc.) — that data
// lives only on the student's device and isn't reachable from the server.
export default async function handler(req, res) {
  // Vercel Cron sends this header automatically when CRON_SECRET is set as
  // an env var; this stops anyone else from triggering mass deletion by
  // hitting the URL directly.
  const authHeader = req.headers.authorization || "";
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const supabase = getAdminClient();
    const nowIso = new Date().toISOString();

    const { data: due, error: findError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("enrollment_status", "withdrawn")
      .lte("scheduled_deletion_date", nowIso);
    if (findError) return res.status(500).json({ error: findError.message });

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

    return res.status(200).json({ ok: true, processed: results.length, results });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
