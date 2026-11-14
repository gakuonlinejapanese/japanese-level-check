// GAKU Reader (Chrome extension) login + request authorization.
// Used by api/claude.js (kept as a helper file because the Vercel function limit is reached):
//   POST /api/claude?reader=login  { email, password }  -> { token, allowed, isGakuStudent, isPaid, reason, daysUntilTrialEnds }
//   POST /api/claude?reader=ai     Authorization: Bearer <token>  -> checked here, then the normal AI handling runs
//
// The password is verified by Supabase Auth. The token we return is our own signed, 30-day token
// (HMAC with a key derived from SUPABASE_SERVICE_ROLE_KEY, so no new env var is needed) — Supabase's
// own access token would expire after 1 hour and force students to log in again constantly.
// Access rules mirror the previous email-based check (api/image-search.js): paid / GAKU student pass,
// 7-day trial, plus the forced_trial_end lock. Nothing is written to the database.
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { getAdminClient } from "./_supabaseAdmin.js";
import { computeTrialFields } from "./_trialStatus.js";

const TOKEN_TTL_MS = 30 * 24 * 3600 * 1000;
// Public anon key (same value as src/supabase.js); env override if configured.
const FALLBACK_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzdWxzZGdybmF4dWVpd2NmbHlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NTYxMzQsImV4cCI6MjA5NjMzMjEzNH0.dYhEtkkB1STVqYL7edihqt0o3-avpmeWC8qGFpZbZyA";

function signingKey() {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("Server credentials not configured");
  return crypto.createHash("sha256").update("gaku-reader-token:" + secret).digest();
}
const b64u = (buf) => Buffer.from(buf).toString("base64url");

function makeToken(uid, email) {
  const payload = b64u(JSON.stringify({ uid, email, exp: Date.now() + TOKEN_TTL_MS }));
  const sig = b64u(crypto.createHmac("sha256", signingKey()).update(payload).digest());
  return payload + "." + sig;
}

function verifyToken(token) {
  const [payload, sig] = String(token || "").split(".");
  if (!payload || !sig) return null;
  const expected = b64u(crypto.createHmac("sha256", signingKey()).update(payload).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (!data.uid || !data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

// Trial/paid/forced-lock status for one account (by user id). Read-only.
async function readerStatus(supabase, uid, email) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, is_gaku_student, is_paid, trial_started_at")
    .eq("id", uid)
    .maybeSingle();
  if (!profile) return { found: false };
  const em = String(email || "").trim().toLowerCase();
  let isGakuStudent = !!profile.is_gaku_student;
  if (!isGakuStudent && em) {
    const { data: invites } = await supabase.from("invite_codes").select("id").eq("student_email", em).limit(1);
    if (invites && invites.length > 0) isGakuStudent = true;
  }
  let status = { found: true, ...computeTrialFields({ ...profile, is_gaku_student: isGakuStudent }) };
  if (em) {
    try {
      const { data: f } = await supabase.from("forced_trial_end").select("email").eq("email", em).limit(1);
      if (f && f.length > 0 && !status.isPaid) status = { ...status, trialExpired: true, isGakuStudent: false };
    } catch {}
  }
  return status;
}

export async function readerLogin(req, res) {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password) {
      return res.status(400).json({ error: "invalid_login" });
    }
    const url = process.env.SUPABASE_URL;
    const anon = process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY;
    const authClient = createClient(url, anon, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data, error } = await authClient.auth.signInWithPassword({ email, password });
    const admin = getAdminClient();
    if (error || !data?.user) {
      const msg = String(error?.message || "").toLowerCase();
      if (error && (error.status === 400 || msg.includes("invalid login") || msg.includes("credentials"))) {
        // Wrong password, or no such account — tell the two apart so the extension can point to sign-up.
        const { data: p } = await admin.from("profiles").select("id").ilike("email", email).limit(1);
        return res.status(401).json({ error: p && p.length > 0 ? "invalid_login" : "account_not_found" });
      }
      if (msg.includes("not confirmed")) return res.status(401).json({ error: "email_not_confirmed" });
      console.error("[reader-login] auth error:", error?.message);
      return res.status(502).json({ error: "auth_unavailable" });
    }
    const user = data.user;
    const st = await readerStatus(admin, user.id, user.email || email);
    if (!st.found) {
      return res.status(200).json({ token: makeToken(user.id, user.email || email), allowed: false, reason: "account_not_found", isGakuStudent: false, isPaid: false });
    }
    const allowed = !st.trialExpired;
    return res.status(200).json({
      token: makeToken(user.id, user.email || email),
      allowed,
      reason: allowed ? null : "trial_ended",
      isGakuStudent: !!st.isGakuStudent,
      isPaid: !!st.isPaid,
      daysUntilTrialEnds: st.daysUntilTrialEnds ?? null,
    });
  } catch (e) {
    console.error("[reader-login] failed:", e.message);
    return res.status(500).json({ error: "server_error" });
  }
}

// Returns { ok:true } or { ok:false, status, error }.
export async function readerAuthorize(req) {
  try {
    const token = String(req.headers?.authorization || "").replace(/^Bearer\s+/i, "");
    const data = verifyToken(token);
    if (!data) return { ok: false, status: 401, error: "login_required" };
    const st = await readerStatus(getAdminClient(), data.uid, data.email);
    if (!st.found) return { ok: false, status: 403, error: "account_not_found" };
    if (st.trialExpired) return { ok: false, status: 403, error: "trial_ended" };
    return { ok: true };
  } catch (e) {
    console.error("[reader-auth] failed:", e.message);
    return { ok: false, status: 500, error: "server_error" };
  }
}
