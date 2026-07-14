import { getAdminClient } from "./_supabaseAdmin.js";

// Reports everything the client needs to decide whether to show/hide the
// paywall, without the user having to refresh the page:
//   - isGakuStudent: redeemed a valid invite code at signup (free plan)
//   - isPaid: Stripe checkout.session.completed came in for this account
//     (set by api/stripe-webhook.js) and hasn't been reset by a
//     withdrawal/re-init since
//   - suspended / suspendedUntil: temporarily locked out (e.g. the
//     3rd-device sharing-suspicion rule), see api/device-check.js
//
// Replaces the old check-gaku-student.js (same request shape) so existing
// callers only need their response-field expectations updated.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("is_gaku_student, is_paid, paid_plan, suspended_until")
      .eq("id", userId)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });

    const suspendedUntil = data?.suspended_until || null;
    const suspended = !!(suspendedUntil && new Date(suspendedUntil) > new Date());

    return res.status(200).json({
      isGakuStudent: !!data?.is_gaku_student,
      isPaid: !!data?.is_paid,
      paidPlan: data?.paid_plan || null,
      suspended,
      suspendedUntil,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
