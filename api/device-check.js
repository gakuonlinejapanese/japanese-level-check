import { getAdminClient, ADMIN_EMAIL } from "./_supabaseAdmin.js";
import { sendEmail } from "./_resend.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { userId, email, deviceId, deviceLabel } = req.body || {};
    if (!userId || !deviceId) return res.status(400).json({ error: "userId and deviceId are required" });

    const supabase = getAdminClient();

    // 1) Already a known, approved device — just bump last_seen.
    const { data: existing } = await supabase
      .from("device_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("device_id", deviceId)
      .maybeSingle();

    if (existing) {
      await supabase.from("device_sessions").update({ last_seen: new Date().toISOString() }).eq("id", existing.id);
      return res.status(200).json({ status: "approved" });
    }

    // 2) First device ever for this account — auto-approve, no email needed.
    const { count } = await supabase
      .from("device_sessions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (!count || count === 0) {
      await supabase.from("device_sessions").insert({
        user_id: userId, device_id: deviceId, device_label: deviceLabel || "Unknown device", approved: true,
      });
      return res.status(200).json({ status: "approved" });
    }

    // 3) A new (2nd+) device — check for an existing pending request first to avoid spamming emails.
    const { data: pending } = await supabase
      .from("device_approval_requests")
      .select("*")
      .eq("user_id", userId)
      .eq("device_id", deviceId)
      .eq("status", "pending")
      .maybeSingle();

    if (pending) {
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

    await Promise.all([
      sendEmail({ to: email, subject: "[GAKU] New device login — please approve", html: studentHtml }),
      sendEmail({ to: ADMIN_EMAIL, subject: "[GAKU] Student new device login — approval needed", html: adminHtml }),
    ]);

    return res.status(200).json({ status: "pending" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
