// GAKU Master Reader (Chrome extension) server-side access control.
// The extension logs in with the student's GAKU Master email + password
// (api/reader-auth.js), receives a signed token, and sends it on every AI
// request (api/reader-ai.js). No valid token for an existing, non-locked
// GAKU Master account => no AI. Email alone is never enough.
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { computeTrialFields } from "./_trialStatus.js";
import { getAdminClient } from "./_supabaseAdmin.js";

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function secret() {
  const s = process.env.READER_TOKEN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!s) throw new Error("Reader token secret not configured");
  return "gaku-reader-v1:" + s;
}
const b64u = (buf) => Buffer.from(buf).toString("base64url");

export function signReaderToken(uid, email) {
  const payload = b64u(JSON.stringify({ uid, email, exp: Date.now() + TOKEN_TTL_MS }));
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return payload + "." + sig;
}

export function verifyReaderToken(token) {
  try {
    if (typeof token !== "string") return null;
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
    const a = Buffer.from(sig), b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.uid || !data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

// Looks the account up by user id and decides whether Reader may be used.
// Mirrors the rules api/image-search.js already applies to Reader.
export async function getReaderAccess(supabase, userId) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, is_gaku_student, is_paid, trial_started_at, suspended_until")
    .eq("id", userId)
    .maybeSingle();
  if (!profile) return { allowed: false, reason: "account_not_found" };
  if (profile.suspended_until && new Date(profile.suspended_until) > new Date()) {
    return { allowed: false, reason: "suspended" };
  }
  let isGaku = !!profile.is_gaku_student;
  if (!isGaku && profile.email) {
    const { data: invites } = await supabase
      .from("invite_codes").select("id")
      .eq("student_email", String(profile.email).trim().toLowerCase()).limit(1);
    if (invites && invites.length > 0) isGaku = true;
  }
  const t = computeTrialFields({ ...profile, is_gaku_student: isGaku });
  if (t.trialExpired) return { allowed: false, reason: "trial_ended", ...t };
  return { allowed: true, ...t };
}

export async function readerLogin(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { email, password } = req.body || {};
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "missing_credentials" });
    }
    const url = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
    const anon = process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;
    if (!url || !anon) return res.status(500).json({ error: "server_not_configured" });
    const authClient = createClient(url, anon, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data, error } = await authClient.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error || !data?.user) return res.status(401).json({ error: "invalid_login" });
    const access = await getReaderAccess(getAdminClient(), data.user.id);
    if (!access.allowed && access.reason === "account_not_found") {
      return res.status(403).json({ error: "account_not_found" });
    }
    // Token is issued even when the trial has ended so the extension can show
    // the right message; api/reader-ai.js still refuses AI calls for locked accounts.
    return res.status(200).json({
      token: signReaderToken(data.user.id, data.user.email),
      allowed: access.allowed,
      reason: access.reason || null,
      isPaid: !!access.isPaid,
      isGakuStudent: !!access.isGakuStudent,
      daysUntilTrialEnds: access.daysUntilTrialEnds ?? null,
    });
  } catch (e) {
    return res.status(500).json({ error: "server_error" });
  }
}

// Authenticated AI path for GAKU Master Reader. Same request/response
// shape as api/claude.js, but requires a valid Reader token (from
// api/reader-auth.js) belonging to an existing, non-locked GAKU Master account.
const accessCache = new Map(); // uid -> { at, access }
const ACCESS_TTL_MS = 60 * 1000;
const usage = new Map(); // uid -> { day, count }  (best-effort, per serverless instance)
const DAILY_LIMIT = 400;

export async function readerAi(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const m = /^Bearer (.+)$/.exec(req.headers.authorization || "");
  const tok = m ? verifyReaderToken(m[1]) : null;
  if (!tok) return res.status(401).json({ error: "login_required" });

  try {
    let entry = accessCache.get(tok.uid);
    if (!entry || Date.now() - entry.at > ACCESS_TTL_MS) {
      entry = { at: Date.now(), access: await getReaderAccess(getAdminClient(), tok.uid) };
      accessCache.set(tok.uid, entry);
    }
    if (!entry.access.allowed) return res.status(403).json({ error: entry.access.reason || "locked" });

    const day = new Date().toISOString().slice(0, 10);
    const u = usage.get(tok.uid);
    if (!u || u.day !== day) usage.set(tok.uid, { day, count: 1 });
    else if (++u.count > DAILY_LIMIT) return res.status(429).json({ error: "daily_limit" });
  } catch (e) {
    // Fail closed: if we cannot verify the account, no AI.
    return res.status(503).json({ error: "verification_unavailable" });
  }
  req.readerAuthed = true;
  return next(req, res);
}
