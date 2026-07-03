import { getAdminClient } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { code, userId } = req.body || {};
    if (!code || !userId) return res.status(400).json({ error: "code and userId are required" });

    const supabase = getAdminClient();
    const { data: invite, error: fetchErr } = await supabase
      .from("invite_codes")
      .select("*")
      .eq("code", code.trim())
      .maybeSingle();
    if (fetchErr) return res.status(500).json({ error: fetchErr.message });
    if (!invite) return res.status(404).json({ error: "Invalid invite code." });
    if (invite.used_by && invite.used_by !== userId) {
      return res.status(409).json({ error: "This invite code has already been used." });
    }

    const { error: updateErr } = await supabase
      .from("invite_codes")
      .update({ used_by: userId, used_at: new Date().toISOString() })
      .eq("id", invite.id);
    if (updateErr) return res.status(500).json({ error: updateErr.message });

    // Mark the student's profile as a verified GAKU student (unlocks the FREE plan).
    // upsert (not update) so this works even if no profile row exists yet.
    await supabase.from("profiles").upsert({ id: userId, is_gaku_student: true });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
