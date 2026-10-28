import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Generates (or reuses) a stable random ID for this browser/device, stored in localStorage.
export function getDeviceId() {
  try {
    let id = localStorage.getItem("gaku_device_id");
    if (!id) {
      id = (crypto?.randomUUID && crypto.randomUUID()) ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("gaku_device_id", id);
    }
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

// A short human-readable label for the current browser, e.g. "Chrome on Mac"
export function getDeviceLabel() {
  try {
    const ua = navigator.userAgent;
    const browser = /Edg/.test(ua) ? "Edge" : /Chrome/.test(ua) ? "Chrome" : /Safari/.test(ua) ? "Safari" : /Firefox/.test(ua) ? "Firefox" : "Browser";
    const isIpadOs = /Macintosh/.test(ua) && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1;
    const os = /iPhone|iPad|iPod/.test(ua) || isIpadOs ? "iOS" : /Mac/.test(ua) ? "Mac" : /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : "device";
    return `${browser} on ${os}`;
  } catch {
    return "Unknown device";
  }
}

// ---- Signup source tracking (first touch) ---------------------------------
// Remembers where a visitor first came from (utm/ref params or the referring site) the
// first time the app loads in this browser, so it can be saved with the account at signup.
function cleanTag(v, max = 80) {
  return String(v || "").trim().toLowerCase().replace(/[^a-z0-9._:\-\/ ]/g, "").slice(0, max);
}
function captureSignupSource() {
  try {
    if (localStorage.getItem("gaku_signup_source")) return;
    const q = new URLSearchParams(window.location.search);
    let refHost = "";
    try { refHost = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : ""; } catch {}
    if (refHost && /(^|\.)seitojapanese\.online$|(^|\.)vercel\.app$/.test(refHost)) refHost = "";
    const utm = q.get("utm_source") || q.get("ref") || q.get("src") || q.get("source");
    const medium = q.get("utm_medium");
    const campaign = q.get("utm_campaign");
    let source = cleanTag(utm);
    if (!source && q.get("fbclid")) source = "facebook";
    if (!source && q.get("gclid")) source = "google-ads";
    if (!source && refHost) source = cleanTag(refHost);
    if (!source) source = "direct";
    const detail = [medium && "m=" + cleanTag(medium, 30), campaign && "c=" + cleanTag(campaign, 40)].filter(Boolean).join(",");
    localStorage.setItem("gaku_signup_source", JSON.stringify({
      source, referrer: cleanTag(refHost, 100), detail, at: new Date().toISOString(),
    }));
  } catch {}
}
captureSignupSource();

export function getSignupSource() {
  try {
    const s = JSON.parse(localStorage.getItem("gaku_signup_source") || "null");
    let platform = "web";
    const cap = typeof window !== "undefined" ? window.Capacitor : null;
    if (cap && typeof cap.isNativePlatform === "function" && cap.isNativePlatform()) {
      platform = (typeof cap.getPlatform === "function" ? cap.getPlatform() : "native") + "-app";
    } else if (window.matchMedia && (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true)) {
      platform = "pwa";
    }
    const source = s ? (s.detail ? `${s.source} (${s.detail})` : s.source) : "unknown";
    return { signupSource: source, signupReferrer: s?.referrer || null, signupPlatform: platform };
  } catch {
    return { signupSource: "unknown", signupReferrer: null, signupPlatform: "web" };
  }
}
