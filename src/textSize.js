// ─── Text size (2026-11-26) ────────────────────────────────────────────────────
// Students can make the text bigger or smaller with the A− / A+ buttons on the dashboard.
// Only text is scaled (not the whole page), so popups, the tutorial pointer and full-height
// screens keep their layout. Write font sizes as fontSize: fz(12) so they follow the setting.
// The choice is saved on the device and applied immediately at startup.
export const TEXT_SIZES = [0.85, 1, 1.15, 1.3, 1.45];
const KEY = "gaku_text_size";

export function fz(px) {
  return `calc(${px}px * var(--gaku-fs, 1))`;
}
export function getSavedTextSize() {
  try {
    const n = Number(localStorage.getItem(KEY));
    return TEXT_SIZES.includes(n) ? n : 1;
  } catch { return 1; }
}
function setCssScale(scale) {
  try {
    const root = document.documentElement.style;
    root.setProperty("--gaku-fs", String(scale));
    // With larger text the dashboard header gets tall, so let it scroll away instead of staying pinned.
    root.setProperty("--gaku-header-pos", scale > 1 ? "relative" : "sticky");
  } catch {}
}
export function applyTextSize(scale) {
  setCssScale(scale);
  try { localStorage.setItem(KEY, String(scale)); } catch {}
}
setCssScale(getSavedTextSize());
