import { getAdminClient } from "./_supabaseAdmin.js";

// Consolidates what used to be 3 separate serverless functions
// (admin-create-invite, validate-invite, redeem-invite) into one file,
// because the Vercel Hobby plan caps deployments at 12 serverless functions.
//
// POST { secret, action: "create", studentEmail, studentName } — admin issues a new invite code
// POST { action: "validate", code, email } — check a code is valid for this email before signup
// POST { action: "redeem", code, userId } — mark a code used and flag the profile as a GAKU student

function randomCode() {
  // e.g. GAKU-7F3K9Q
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `GAKU-${s}`;
}

async function handleCreate(supabase, body, res) {
  const { secret, studentEmail, studentName } = body;
  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!studentEmail) return res.status(400).json({ error: "studentEmail is required" });

  const code = randomCode();
  const { data, error } = await supabase
    .from("invite_codes")
    .insert({ code, student_email: studentEmail.trim().toLowerCase(), student_name: studentName || null })
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json({ code: data.code });
}

async function handleValidate(supabase, body, res) {
  const { code, email } = body;
  if (!code || !email) return res.status(400).json({ error: "code and email are required" });

  const { data, error } = await supabase
    .from("invite_codes")
    .select("*")
    .eq("code", code.trim())
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Invalid invite code." });
  if (data.student_email.toLowerCase() !== email.trim().toLowerCase()) {
    return res.status(403).json({ error: "This invite code is registered to a different email address." });
  }
  // A code that matches its registered email is always valid for that student,
  // even if it was redeemed before (password reset / re-signup / new device, etc).
  return res.status(200).json({ ok: true });
}

async function handleRedeem(supabase, body, res) {
  const { code, userId } = body;
  if (!code || !userId) return res.status(400).json({ error: "code and userId are required" });

  const { data: invite, error: fetchErr } = await supabase
    .from("invite_codes")
    .select("*")
    .eq("code", code.trim())
    .maybeSingle();
  if (fetchErr) return res.status(500).json({ error: fetchErr.message });
  if (!invite) return res.status(404).json({ error: "Invalid invite code." });

  if (invite.used_by && invite.used_by !== userId) {
    // Someone else already holds this redemption — only allow re-assigning it
    // to a new userId if that account's email still matches the code's
    // registered email (e.g. student deleted/recreated their account, or
    // signed up fresh after a password reset).
    const { data: userData, error: userErr } = await supabase.auth.admin.getUserById(userId);
    if (userErr || !userData?.user?.email) {
      return res.status(409).json({ error: "This invite code has already been used." });
    }
    if (userData.user.email.trim().toLowerCase() !== invite.student_email.toLowerCase()) {
      return res.status(409).json({ error: "This invite code has already been used." });
    }
  }

  const { error: updateErr } = await supabase
    .from("invite_codes")
    .update({ used_by: userId, used_at: new Date().toISOString() })
    .eq("id", invite.id);
  if (updateErr) return res.status(500).json({ error: updateErr.message });

  // Mark the student's profile as a verified GAKU student (unlocks the FREE plan).
  // upsert (not update) so this works even if no profile row exists yet.
  await supabase.from("profiles").upsert({ id: userId, is_gaku_student: true });

  return res.status(200).json({ ok: true });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const supabase = getAdminClient();
    const body = req.body || {};
    const { action } = body;
    if (action === "create") return await handleCreate(supabase, body, res);
    if (action === "validate") return await handleValidate(supabase, body, res);
    if (action === "redeem") return await handleRedeem(supabase, body, res);
    return res.status(400).json({ error: "Unknown action" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
