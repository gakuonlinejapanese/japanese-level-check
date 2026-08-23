// Shared trial-days calculation. api/account-status.js (main app, looks up
// by userId) and the reader-install-log POST branch in api/image-search.js
// (GAKU Reader extension, looks up by email since it has no Supabase
// userId) both need this same logic. Keep TRIAL_DAYS in sync between the
// two call sites if it ever changes.
export const TRIAL_DAYS = 7;

export function computeTrialFields(profile) {
  const isGakuStudent = !!profile?.is_gaku_student;
  const isPaid = !!profile?.is_paid;
  const trialStartedAt = profile?.trial_started_at ? new Date(profile.trial_started_at) : null;
  const daysSinceTrial = trialStartedAt ? (Date.now() - trialStartedAt.getTime()) / 86400000 : null;
  const trialExpired = !isPaid && !isGakuStudent && daysSinceTrial !== null && daysSinceTrial >= TRIAL_DAYS;
  const daysUntilTrialEnds = daysSinceTrial !== null ? Math.max(0, Math.ceil(TRIAL_DAYS - daysSinceTrial)) : null;
  return { isGakuStudent, isPaid, trialExpired, daysUntilTrialEnds };
}
