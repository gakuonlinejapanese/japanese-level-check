// Sends a short crash report to the server log (Vercel runtime logs, "[client-crash]") so a
// "white screen" report from a student can be traced to the real error + browser, instead of
// guessing. Never throws and never blocks the UI.
const _seen = new Set();

function guessUser() {
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && /^sb-.*-auth-token$/.test(k)) {
        const v = JSON.parse(localStorage.getItem(k) || "null");
        const u = v && (v.user || (v.currentSession && v.currentSession.user));
        if (u) return { userId: u.id || null, email: u.email || null };
      }
    }
  } catch {}
  return { userId: null, email: null };
}

export function reportClientCrash(where, error, extra) {
  try {
    const message = String((error && error.message) || error || "unknown").slice(0, 300);
    const key = where + "|" + message;
    if (_seen.has(key)) return;
    _seen.add(key);
    if (_seen.size > 20) return;
    const u = guessUser();
    const report = {
      where,
      message,
      stack: String((error && error.stack) || "").slice(0, 900),
      component: String((extra && extra.componentStack) || "").slice(0, 500),
      ua: (typeof navigator !== "undefined" && navigator.userAgent) || "",
      url: (typeof window !== "undefined" && window.location.pathname) || "",
      native: !!(typeof window !== "undefined" && window.Capacitor && typeof window.Capacitor.isNativePlatform === "function" && window.Capacitor.isNativePlatform()),
      ...u,
    };
    fetch("/api/account-status", {
      method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
      body: JSON.stringify({ crashReport: report }),
    }).catch(() => {});
  } catch {}
}

// Errors that happen outside React rendering (event handlers, effects, promises) don't unmount the
// screen by themselves, but they are exactly the kind of thing we want to see in the logs.
export function installGlobalCrashReporting() {
  try {
    window.addEventListener("error", (e) => reportClientCrash("window.error", e && (e.error || e.message)));
    window.addEventListener("unhandledrejection", (e) => reportClientCrash("unhandledrejection", e && e.reason));
  } catch {}
}
