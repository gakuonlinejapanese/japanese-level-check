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

    // trial_started_at marks the very first time this account was created —
    // used by api/account-status.js to enforce the 7-day free trial /
    // 10-day data-reset window server-side (so it can't be reset just by
    // uninstalling/reinstalling the app). Only set it if this account
    // doesn't already have one, so a retried signup call never pushes it
    // forward and grants extra free days.
    const { data: existing } = await supabase
      .from("profiles")
      .select("trial_started_at")
      .eq("id", userId)
      .maybeSingle();

    const payload = { id: userId, email: normalizedEmail, is_gaku_student: !!isGakuStudent };
    if (!existing?.trial_started_at) payload.trial_started_at = new Date().toISOString();

    const { error } = await supabase.from("profiles").upsert(payload);
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
