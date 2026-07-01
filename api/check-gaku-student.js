import { getAdminClient } from "./_supabaseAdmin.js";

// Returns whether a logged-in user's profile is flagged as a GAKU student
// (i.e. they redeemed a valid invite code at signup). Uses the admin client
// so this works regardless of the profiles table's RLS policies — the
// client-side app should never need direct read access to this table.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("is_gaku_student")
      .eq("id", userId)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ isGakuStudent: !!data?.is_gaku_student });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
