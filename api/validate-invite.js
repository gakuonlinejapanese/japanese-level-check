import { getAdminClient } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { code, email } = req.body || {};
    if (!code || !email) return res.status(400).json({ error: "code and email are required" });

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("invite_codes")
      .select("*")
      .eq("code", code.trim())
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: "Invalid invite code." });
    if (data.student_email.toLowerCase() !== email.trim().toLowerCase()) {
      return res.status(403).json({ error: "This invite code is registered to a different email address." });
    }
    if (data.used_by) {
      return res.status(409).json({ error: "This invite code has already been used." });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
