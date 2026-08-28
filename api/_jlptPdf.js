import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Builds a simple one-page JLPT diagnosis report PDF and returns it as a base64 string
// (no data: prefix — matches what api/_resend.js's sendEmail attachments/Brevo expect, and
// what the client decodes with atob() for download). Kept deliberately simple (Helvetica,
// no Japanese glyphs) since pdf-lib's standard fonts don't support Japanese text — student
// name/notes should stay romaji/English-safe, or a custom font would need to be embedded later.
export async function buildJlptResultPdf({ studentName, studentEmail, jlptLevel, passed, score, testDate, notes }) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const teal = rgb(0.02, 0.71, 0.83);
  const dark = rgb(0.06, 0.09, 0.16);
  const gray = rgb(0.4, 0.45, 0.55);
  const green = rgb(0.2, 0.7, 0.35);
  const red = rgb(0.85, 0.25, 0.25);

  let y = 780;
  const draw = (text, opts = {}) => {
    page.drawText(text, { x: opts.x ?? 50, y, size: opts.size ?? 12, font: opts.bold ? bold : font, color: opts.color ?? dark });
    y -= opts.gap ?? 22;
  };

  draw("GAKU Online Japanese", { size: 12, bold: true, color: teal, gap: 18 });
  draw("JLPT Diagnosis Report", { size: 22, bold: true, gap: 36 });

  draw(`Student: ${studentName || studentEmail}`, { size: 13, bold: true });
  draw(`Email: ${studentEmail}`, { size: 11, color: gray });
  draw(`Level tested: ${jlptLevel}`, { size: 13, bold: true, gap: 30 });

  if (passed !== null && passed !== undefined) {
    draw(passed ? "Result: PASS" : "Result: NOT PASS", { size: 16, bold: true, color: passed ? green : red, gap: 26 });
  }
  if (score) draw(`Score: ${score}`, { size: 12, gap: 22 });
  if (testDate) draw(`Test date: ${testDate}`, { size: 12, gap: 22 });

  if (notes) {
    y -= 6;
    draw("Notes from your teacher:", { size: 11, bold: true, color: gray, gap: 18 });
    const words = String(notes).split(/\s+/);
    let line = "";
    const maxWidth = 495;
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(test, 11) > maxWidth) { draw(line, { size: 11, gap: 16 }); line = w; }
      else line = test;
    }
    if (line) draw(line, { size: 11, gap: 16 });
  }

  y = 60;
  draw("Presented by Seito Sakamoto, GAKU Online Japanese", { x: 50, size: 9, color: gray, gap: 0 });

  const bytes = await doc.save();
  return Buffer.from(bytes).toString("base64");
}
