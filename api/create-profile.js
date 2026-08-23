import { getAdminClient } from "./_supabaseAdmin.js";

// Creates/updates a student's profile row right after signup. Uses the admin
// client so this always succeeds regardless of the profiles table's RLS
// policies (the previous client-side upsert could fail silently if RLS
// blocked the write, leaving the profiles table without a row at all).
//
// Anti-retrial-abuse: the `trial_history` table is a permanent fingerprint
// log (by email AND by device id) that survives self_delete/account-deletion
// (see api/admin-withdrawal.js — it never touches trial_history). If either
// this email or this device already appears there, this is a *returning*
// account trying to get a fresh 7-day trial by deleting and re-signing up —
// so instead of starting a brand-new trial, trial_started_at is backdated
// past the 7-day mark. api/account-status.js then reports trialExpired=true
// on the very next check, and the student sees the payment screen right away
// instead of another free week. A ~2-day buffer is kept before the 10-day
// data-reset cutoff so a fast payment right after signup isn't punished.
const TRIAL_DAYS = 7;
const BACKDATE_DAYS = TRIAL_DAYS + 1; // just past the trial cutoff, safely under the 10-day wipe cutoff

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { userId, email, isGakuStudent, deviceId } = req.body || {};
    if (!userId || !email) return res.status(400).json({ error: "userId and email are required" });
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedDeviceId = (deviceId || "").trim() || null;

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
    const isFirstTrialGrant = !existing?.trial_started_at;
    let priorTrialAt = null;

    if (isFirstTrialGrant) {
      const orParts = [`email.eq.${normalizedEmail}`];
      if (normalizedDeviceId) orParts.push(`device_id.eq.${normalizedDeviceId}`);
      const { data: priorRows } = await supabase
        .from("trial_history")
        .select("first_trial_started_at")
        .or(orParts.join(","))
        .order("first_trial_started_at", { ascending: true })
        .limit(1);
      priorTrialAt = priorRows?.[0]?.first_trial_started_at || null;

      payload.trial_started_at = priorTrialAt
        ? new Date(Date.now() - BACKDATE_DAYS * 86400000).toISOString()
        : new Date().toISOString();
    }

    const { error } = await supabase.from("profiles").upsert(payload);
    if (error) return res.status(500).json({ error: error.message });

    // Record this email/device fingerprint permanently (once per signup),
    // so a future account deletion + re-signup with either the same email
    // or the same device is caught even though the profiles row is gone.
    if (isFirstTrialGrant) {
      try {
        await supabase.from("trial_history").insert({
          email: normalizedEmail,
          device_id: normalizedDeviceId,
          first_trial_started_at: priorTrialAt || payload.trial_started_at,
        });
      } catch (logErr) {
        console.error("[create-profile] trial_history insert failed:", logErr.message);
      }
    }

    return res.status(200).json({ ok: true, reusedTrial: !!priorTrialAt });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
