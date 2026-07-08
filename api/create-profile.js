import { getAdminClient } from "./_supabaseAdmin.js";

// Creates/updates a student's profile row right after signup. Uses the admin
// client so this always succeeds regardless of the profiles table's RLS
// policies (the previous client-side upsert could fail silently if RLS
// blocked the write, leaving the profiles table without a row at all).
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { userId, email, isGakuStudent } = req.body || {};
    if (!userId || !email) return res.status(400).json({ error: "userId and email are required" });
    const normalizedEmail = email.trim().toLowerCase();

    const supabase = getAdminClient();
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: userId, email: normalizedEmail, is_gaku_student: !!isGakuStudent });
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
