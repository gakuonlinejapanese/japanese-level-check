import { getAdminClient } from "./_supabaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { secret } = req.body || {};
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, withdrawal_date, withdrawal_reason, scheduled_deletion_date")
      .eq("enrollment_status", "withdrawn")
      .order("scheduled_deletion_date", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ students: data || [] });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
