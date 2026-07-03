import { getAdminClient } from "./_supabaseAdmin.js";

function randomCode() {
  // e.g. GAKU-7F3K9Q
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `GAKU-${s}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { secret, studentEmail, studentName } = req.body || {};
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!studentEmail) return res.status(400).json({ error: "studentEmail is required" });

    const supabase = getAdminClient();
    const code = randomCode();
    const { data, error } = await supabase
      .from("invite_codes")
      .insert({ code, student_email: studentEmail.trim().toLowerCase(), student_name: studentName || null })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ code: data.code });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
