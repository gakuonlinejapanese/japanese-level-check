import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const HEADER_EMOJI = /^[📊🔢✅🎯📌🔍🟠🔴🟢🗓🌟⚠️❌]/u;
const PAGE_W = 595, PAGE_H = 842, MARGIN = 50, MAX_WIDTH = PAGE_W - MARGIN * 2;

// pdf-lib's standard fonts (WinAnsi encoding) can't draw emoji/most non-Latin symbols — strip
// them out before drawing (header/body classification below still runs on the ORIGINAL line,
// before stripping, so an emoji-prefixed header is still detected as a header even once its
// emoji is gone from the rendered text).
const stripUnsupportedGlyphs = (s) => Array.from(
    s.replace(/（/g, " (").replace(/）/g, ") ").replace(/→/g, " -> ").replace(/・/g, ", ")
  )
  .filter((ch) => ch.codePointAt(0) <= 0x00ff || /[’‘“”–—…]/.test(ch))
  .join("")
  .replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/…/g, "...")
  .replace(/\s{2,}/g, " ")
  .trim();

// Renders an arbitrary free-form report (e.g. a full JLPT diagnosis with score tables, study
// plans, etc.) into a paginated PDF. Deliberately generic rather than parsing a fixed schema:
// lines that start with one of the emoji above are treated as section headers (bold, bigger,
// teal), everything else is word-wrapped body text. This keeps it working for whatever report
// shape the teacher pastes next time, not just this exact template.
export async function buildRichReportPdf({ studentName, studentEmail, jlptLevel, title, rawText }) {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const teal = rgb(0.02, 0.71, 0.83);
  const dark = rgb(0.06, 0.09, 0.16);
  const gray = rgb(0.4, 0.45, 0.55);

  let page = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - 60;

  const footer = (p) => {
    p.drawText("Presented by Seito Sakamoto, GAKU Online Japanese", { x: MARGIN, y: 30, size: 8, font, color: gray });
  };
  const newPage = () => {
    footer(page);
    page = doc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - 60;
  };
  const ensureSpace = (needed) => { if (y - needed < 50) newPage(); };

  const wrapLines = (text, f, size, maxWidth) => {
    const words = text.split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (f.widthOfTextAtSize(test, size) > maxWidth && line) { lines.push(line); line = w; }
      else line = test;
    }
    if (line) lines.push(line);
    return lines;
  };

  const drawParagraph = (text, { size = 11, f = font, color = dark, gap = 15, indent = 0 } = {}) => {
    const lines = wrapLines(text, f, size, MAX_WIDTH - indent);
    for (const l of lines) {
      ensureSpace(gap + 4);
      page.drawText(l, { x: MARGIN + indent, y, size, font: f, color });
      y -= gap;
    }
  };

  // Title block
  page.drawText("GAKU Online Japanese", { x: MARGIN, y, size: 11, font: bold, color: teal }); y -= 16;
  page.drawText(title || "JLPT Diagnosis Report", { x: MARGIN, y, size: 20, font: bold, color: dark }); y -= 30;
  page.drawText(`Student: ${studentName || studentEmail}`, { x: MARGIN, y, size: 12, font: bold, color: dark }); y -= 16;
  page.drawText(`Email: ${studentEmail}`, { x: MARGIN, y, size: 10, font, color: gray }); y -= 14;
  if (jlptLevel) { page.drawText(`Level: ${jlptLevel}`, { x: MARGIN, y, size: 10, font, color: gray }); y -= 14; }
  y -= 10;

  const rawLines = String(rawText || "").split(/\r?\n/).map(l => l.trim());
  for (const raw of rawLines) {
    if (!raw) { y -= 6; continue; }
    const isHeader = HEADER_EMOJI.test(raw);
    const clean = stripUnsupportedGlyphs(raw);
    if (!clean) continue;
    if (isHeader) {
      ensureSpace(30);
      y -= 6;
      drawParagraph(`* ${clean}`, { size: 13, f: bold, color: teal, gap: 17 });
      y -= 4;
    } else {
      drawParagraph(clean, { size: 10.5, f: font, color: dark, gap: 14 });
    }
  }
  footer(page);

  const bytes = await doc.save();
  return Buffer.from(bytes).toString("base64");
}
