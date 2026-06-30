import { getAdminClient } from "./_supabaseAdmin.js";

function page(message) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>GAKU</title>
  <style>body{font-family:sans-serif;background:#0f172a;color:#f1f5f9;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
  .box{max-width:420px;text-align:center;padding:32px}</style></head>
  <body><div class="box"><h2>GAKU</h2><p>${message}</p></div></body></html>`;
}

export default async function handler(req, res) {
  try {
    const { token, role } = req.query || {};
    if (!token || !["student", "admin"].includes(role)) {
      res.setHeader("Content-Type", "text/html");
      return res.status(400).send(page("Invalid link. Please check your email and try again."));
    }

    const supabase = getAdminClient();
    const { data: reqRow, error } = await supabase
      .from("device_approval_requests")
      .select("*")
      .eq("approval_token", token)
      .maybeSingle();

    res.setHeader("Content-Type", "text/html");
    if (error || !reqRow) return res.status(404).send(page("Request not found. This link may have expired."));
    if (reqRow.status !== "pending") return res.status(200).send(page("This request has already been processed."));
    if (new Date(reqRow.expires_at) < new Date()) {
      await supabase.from("device_approval_requests").update({ status: "expired" }).eq("id", reqRow.id);
      return res.status(410).send(page("This link has expired. Please log in again to request a new one."));
    }

    const field = role === "student" ? "student_approved" : "admin_approved";
    const update = { [field]: true };
    const nowApproved = role === "student" ? reqRow.admin_approved : reqRow.student_approved;

    if (nowApproved) {
      update.status = "approved";
    }
    await supabase.from("device_approval_requests").update(update).eq("id", reqRow.id);

    if (nowApproved) {
      await supabase.from("device_sessions").upsert({
        user_id: reqRow.user_id, device_id: reqRow.device_id, device_label: reqRow.device_label, approved: true, last_seen: new Date().toISOString(),
      }, { onConflict: "user_id,device_id" });
      return res.status(200).send(page("✅ Device approved! You can now use GAKU on this device."));
    }

    return res.status(200).send(page("✅ Your approval has been recorded. Once the other party approves (student or Seito), this device will be unlocked."));
  } catch (e) {
    res.setHeader("Content-Type", "text/html");
    return res.status(500).send(page("Something went wrong. Please try again."));
  }
}
