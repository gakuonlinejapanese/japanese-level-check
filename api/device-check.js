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
      <p>こんにちは,</p>
      <p>あなたのGAKUアカウントに、新しい端末（${deviceLabel || "不明な端末"}）からログインがありました。</p>
      <p>これがあなた自身による操作であれば、下のリンクをクリックして許可してください。Seito先生の承認と合わせて両方が完了すると、その端末でも利用できるようになります。</p>
      <p><a href="${studentLink}">この端末を許可する →</a></p>
      <p>身に覚えがない場合は、このメールを無視し、パスワードの変更をおすすめします。</p>
    `;
    const adminHtml = `
      <p>Seitoさん,</p>
      <p>生徒（${email || userId}）のGAKUアカウントに、新しい端末（${deviceLabel || "不明な端末"}）からのログインがありました。</p>
      <p>問題なければ下のリンクで承認してください。生徒本人の承認と合わせて両方完了すると有効になります。</p>
      <p><a href="${adminLink}">この端末を承認する →</a></p>
    `;

    await Promise.all([
      sendEmail({ to: email, subject: "【GAKU】新しい端末からのログインを確認してください", html: studentHtml }),
      sendEmail({ to: ADMIN_EMAIL, subject: "【GAKU】生徒の新しい端末ログインの承認依頼", html: adminHtml }),
    ]);

    return res.status(200).json({ status: "pending" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
