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
