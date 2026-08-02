import { getAdminClient, ADMIN_EMAIL } from "./_supabaseAdmin.js";
import { sendEmail } from "./_resend.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { userId, email, deviceId, deviceLabel, isPwaStandalone } = req.body || {};
    if (!userId || !deviceId) return res.status(400).json({ error: "userId and deviceId are required" });
    console.log(`[device-check] request email=${email} deviceLabel=${deviceLabel} deviceId=${deviceId?.slice(0, 8)}…`);

    const supabase = getAdminClient();

    // 0) If this account is under an active 3rd-device suspension, block
    // every device — including already-approved ones — until it lifts.
    const { data: profile } = await supabase
      .from("profiles")
      .select("suspended_until")
      .eq("id", userId)
      .maybeSingle();
    if (profile?.suspended_until && new Date(profile.suspended_until) > new Date()) {
      return res.status(200).json({ status: "suspended", suspendedUntil: profile.suspended_until });
    }

    // 1) Already a known, approved device — just bump last_seen.
    const { data: existing } = await supabase
      .from("device_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("device_id", deviceId)
      .maybeSingle();

    if (existing) {
      console.log(`[device-check] result=approved (already-known device) deviceLabel=${deviceLabel}`);
      await supabase.from("device_sessions").update({ last_seen: new Date().toISOString() }).eq("id", existing.id);
      if (isPwaStandalone) {
        await supabase.from("profiles").update({ pwa_detected_at: new Date().toISOString() }).eq("id", userId).is("pwa_detected_at", null);
      }
      return res.status(200).json({ status: "approved" });
    }

    // 2) First device ever for this account — auto-approve, no email needed.
    const { count } = await supabase
      .from("device_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (!count || count === 0) {
      console.log(`[device-check] result=approved (first device, auto-approved) deviceLabel=${deviceLabel}`);
      await supabase.from("device_sessions").insert({
        user_id: userId, device_id: deviceId, device_label: deviceLabel || "Unknown device", approved: true,
      });
      if (isPwaStandalone) {
        await supabase.from("profiles").update({ pwa_detected_at: new Date().toISOString() }).eq("id", userId).is("pwa_detected_at", null);
      }
      return res.status(200).json({ status: "approved" });
    }

    // 3) A brand-new 3rd (or later) device, when this account already has 2
    // approved devices on file — this is treated as suspected account sharing.
    // Instead of wiping the account's data, lock it out for one week and
    // notify both the student and Seito by email.
    if (count >= 2) {
      const suspendedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const { error: suspendErr } = await supabase
        .from("profiles")
        .update({ suspended_until: suspendedUntil, suspended_reason: "third_device" })
        .eq("id", userId);
      if (suspendErr) return res.status(500).json({ error: suspendErr.message });

      const untilLabel = new Date(suspendedUntil).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const studentSuspendHtml = `
        <p>Hi,</p>
        <p>Your GAKU account was just used to log in from a 3rd device (<strong>${deviceLabel || "Unknown device"}</strong>), beyond the 2 devices already approved on your account.</p>
        <p>As a precaution against account sharing, access has been temporarily suspended for one week (until <strong>${untilLabel}</strong>).</p>
        <p>If this was a mistake or you have questions, please contact Seito directly.</p>
      `;
      const adminSuspendHtml = `
        <p>Hi Seito,</p>
        <p>Student <strong>${email || userId}</strong> logged in from a 3rd device (<strong>${deviceLabel || "Unknown device"}</strong>) — beyond their 2 already-approved devices.</p>
        <p>Their account has been automatically suspended for one week (until <strong>${untilLabel}</strong>) on suspicion of account sharing.</p>
      `;
      await Promise.all([
        sendEmail({ to: email, subject: "[GAKU] Account temporarily suspended — 3rd device detected", html: studentSuspendHtml }),
        sendEmail({ to: ADMIN_EMAIL, subject: "[GAKU] Student suspended — 3rd device detected", html: adminSuspendHtml }),
      ]);

      return res.status(200).json({ status: "suspended", suspendedUntil });
    }

    // 4) A new 2nd device — check for an existing pending request first to avoid spamming emails.
    const { data: pending } = await supabase
      .from("device_approval_requests")
      .select("*")
      .eq("user_id", userId)
      .eq("device_id", deviceId)
      .eq("status", "pending")
      .maybeSingle();

    if (pending) {
      console.log(`[device-check] result=pending (approval already requested earlier, not re-sending email) deviceLabel=${deviceLabel}`);
      return res.status(200).json({ status: "pending" });
    }

    const { data: created, error: insertErr } = await supabase
      .from("device_approval_requests")
      .insert({ user_id: userId, device_id: deviceId, device_label: deviceLabel || "Unknown device" })
      .select()
      .single();
    if (insertErr) return res.status(500).json({ error: insertErr.message });

    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://japanese-level-check.vercel.app";
    const studentLink = `${base}/api/approve-device?token=${created.approval_token}&role=student`;
    const adminLink = `${base}/api/approve-device?token=${created.approval_token}&role=admin`;

    const studentHtml = `
      <p>Hi,</p>
      <p>A new device (<strong>${deviceLabel || "Unknown device"}</strong>) just logged into your GAKU account.</p>
      <p>If this was you, please click the link below to approve it. Access will be granted once both you and Seito approve.</p>
      <p><a href="${studentLink}" style="color:#a855f7">Approve this device →</a></p>
      <p>If you did not do this, ignore this email and consider changing your password.</p>
    `;
    const adminHtml = `
      <p>Hi Seito,</p>
      <p>Student <strong>${email || userId}</strong> has logged in from a new device: <strong>${deviceLabel || "Unknown device"}</strong>.</p>
      <p>Please click below to approve. Access is granted only after both you and the student approve.</p>
      <p><a href="${adminLink}" style="color:#a855f7">Approve this device →</a></p>
    `;

    console.log(`[device-check] result=pending (NEW 2nd device — sending approval emails) to=${email} admin=${ADMIN_EMAIL} deviceLabel=${deviceLabel}`);
    try {
      const [studentResult, adminResult] = await Promise.all([
        sendEmail({ to: email, subject: "[GAKU] New device login — please approve", html: studentHtml }),
        sendEmail({ to: ADMIN_EMAIL, subject: "[GAKU] Student new device login — approval needed", html: adminHtml }),
      ]);
      console.log(`[device-check] approval emails SENT OK student=${JSON.stringify(studentResult)} admin=${JSON.stringify(adminResult)}`);
    } catch (emailErr) {
      console.error(`[device-check] approval emails FAILED: ${emailErr.message}`);
    }

    return res.status(200).json({ status: "pending" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
