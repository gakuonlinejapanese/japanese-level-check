import { getAdminClient } from "./_supabaseAdmin.js";

// Consolidates what used to be 4 separate serverless functions
// (admin-withdraw-student, admin-cancel-withdrawal, admin-list-withdrawn,
// cron-delete-withdrawn) into one file, because the Vercel Hobby plan caps
// deployments at 12 serverless functions.
//
// POST { secret, action: "withdraw", studentEmail, graceDays, reason } — mark a student withdrawn
// POST { secret, action: "cancel", studentEmail } — undo a pending withdrawal
// POST { secret, action: "list" } — list students pending deletion
// GET with header Authorization: Bearer CRON_SECRET — run the daily deletion job (used by vercel.json cron)

async function handleWithdraw(supabase, body, res) {
  const { studentEmail, graceDays, reason } = body;
  if (!studentEmail) return res.status(400).json({ error: "studentEmail is required" });

  const days = Number.isFinite(Number(graceDays)) && Number(graceDays) >= 0 ? Number(graceDays) : 14;
  const email = studentEmail.trim().toLowerCase();

  const { data: profile, error: findError } = await supabase
    .from("profiles").select("id, email").eq("email", email).maybeSingle();
  if (findError) return res.status(500).json({ error: findError.message });
  if (!profile) return res.status(404).json({ error: "Student not found" });

  const now = new Date();
  const scheduledDeletion = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      is_gaku_student: false,
      enrollment_status: "withdrawn",
      withdrawal_date: now.toISOString(),
      withdrawal_reason: reason || null,
      scheduled_deletion_date: scheduledDeletion.toISOString(),
    })
    .eq("id", profile.id);
  if (updateError) return res.status(500).json({ error: updateError.message });

  return res.status(200).json({
    ok: true,
    scheduledDeletionDate: scheduledDeletion.toISOString(),
    reminder: "Stripe側の解約/プラン変更は自動化されていません。Stripeダッシュボードで手動対応してください。",
  });
}

async function handleCancel(supabase, body, res) {
  const { studentEmail } = body;
  if (!studentEmail) return res.status(400).json({ error: "studentEmail is required" });
  const email = studentEmail.trim().toLowerCase();

  const { data: profile, error: findError } = await supabase
    .from("profiles").select("id, email").eq("email", email).maybeSingle();
  if (findError) return res.status(500).json({ error: findError.message });
  if (!profile) return res.status(404).json({ error: "Student not found" });

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      is_gaku_student: true,
      enrollment_status: "active",
      withdrawal_date: null,
      withdrawal_reason: null,
      scheduled_deletion_date: null,
    })
    .eq("id", profile.id);
  if (updateError) return res.status(500).json({ error: updateError.message });

  return res.status(200).json({ ok: true });
}

async function handleList(supabase, res) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, withdrawal_date, withdrawal_reason, scheduled_deletion_date")
    .eq("enrollment_status", "withdrawn")
    .order("scheduled_deletion_date", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ students: data || [] });
}

async function handleCronDelete(supabase, res) {
  const nowIso = new Date().toISOString();
  const { data: due, error: findError } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("enrollment_status", "withdrawn")
    .lte("scheduled_deletion_date", nowIso);
  if (findError) return res.status(500).json({ error: findError.message });

  const results = [];
  for (const profile of due || []) {
    try {
      await supabase.from("assigned_vocab").delete().eq("student_id", profile.id);
      await supabase.from("device_approval_requests").delete().eq("user_id", profile.id);
      await supabase.from("profiles").delete().eq("id", profile.id);
      await supabase.auth.admin.deleteUser(profile.id);
      results.push({ email: profile.email, deleted: true });
    } catch (innerErr) {
      results.push({ email: profile.email, deleted: false, error: innerErr.message });
    }
  }
  return res.status(200).json({ ok: true, processed: results.length, results });
}

export default async function handler(req, res) {
  const supabase = getAdminClient();

  // Vercel Cron hits this with GET + the CRON_SECRET bearer token.
  if (req.method === "GET") {
    const authHeader = req.headers.authorization || "";
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      return await handleCronDelete(supabase, res);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body || {};
    const { secret, action } = body;
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (action === "withdraw") return await handleWithdraw(supabase, body, res);
    if (action === "cancel") return await handleCancel(supabase, body, res);
    if (action === "list") return await handleList(supabase, res);
    return res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
