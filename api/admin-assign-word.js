import { getAdminClient } from "./_supabaseAdmin.js";
import { buildJlptResultPdf } from "./_jlptPdf.js";
import { sendEmail } from "./_resend.js";

// Lets the teacher (Seito) push a vocabulary word directly into a specific
// student's GAKU account, without ever needing that student's password.
// The student is looked up by email in the `profiles` table (populated at
// signup — see create-profile.js) to get their Supabase user id, then the
// word is inserted into `assigned_vocab` keyed by that id. The student's
// browser picks it up automatically next time they open the app (see the
// syncAssignedVocab logic in GakuApp.jsx) and it's removed from the queue
// once delivered.
export default async function handler(req, res) {
  // The GAKU Reader Chrome extension calls this endpoint cross-origin, so the
  // browser sends a CORS preflight (OPTIONS) request first. Without these
  // headers the preflight gets rejected and the browser never sends the
  // actual POST, which is what caused "Send to student" to silently fail.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  // GET: return every headword ever assigned to a given student (delivered
  // or still pending), so GAKU Reader can block re-sending a word the
  // student already has. assigned_vocab rows are now kept permanently
  // (marked with delivered_at instead of being deleted — see
  // syncAssignedVocab in GakuApp.jsx) specifically so this lookup works even
  // after the student has already received the word into their own vocab.
  if (req.method === "GET") {
    try {
      const { secret, studentEmail } = req.query || {};
      if (!secret || secret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (!studentEmail) {
        return res.status(400).json({ error: "studentEmail is required" });
      }
      const supabase = getAdminClient();
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("id, email")
        .ilike("email", String(studentEmail).trim())
        .maybeSingle();
      if (profileErr) return res.status(500).json({ error: profileErr.message });
      if (!profile) {
        return res.status(404).json({ error: "No student found with that email." });
      }
      const { data: rows, error: vocabErr } = await supabase
        .from("assigned_vocab")
        .select("word")
        .eq("student_id", profile.id);
      if (vocabErr) return res.status(500).json({ error: vocabErr.message });
      const words = [...new Set((rows || []).map((r) => (r.word || "").trim()).filter(Boolean))];
      return res.status(200).json({ ok: true, words });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Reuses this same route (rather than a new serverless function — the project is already
  // at Vercel's 12-function cap on the Hobby plan) for a second admin bulk-send action: pushing
  // a JLPT diagnosis result (entered manually by the teacher after a student takes the real
  // JLPT exam, same "paste and send" workflow as the vocab bulk-send above) into a new
  // `jlpt_results` table. The PDF report is only ever readable by that student once logged in
  // (RLS: `student_id = auth.uid()`, see the jlpt_results migration) — the notification email
  // deliberately does NOT attach the PDF, only a link to log into GAKU Master, so results stay
  // gated behind login as requested.
  if (req.body?.action === "submit_jlpt_result") {
    try {
      const { secret, studentEmail, jlptLevel, passed, score, testDate, notes } = req.body || {};
      if (!secret || secret !== process.env.ADMIN_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      if (!studentEmail || !jlptLevel) {
        return res.status(400).json({ error: "studentEmail and jlptLevel are required" });
      }

      const supabase = getAdminClient();
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("id, email")
        .ilike("email", String(studentEmail).trim())
        .maybeSingle();
      if (profileErr) return res.status(500).json({ error: profileErr.message });
      if (!profile) {
        return res.status(404).json({ error: "No student found with that email. Make sure they've signed up in GAKU first." });
      }

      const passedBool = passed === true || passed === "true" || passed === "pass" || passed === "合格"
        ? true
        : (passed === false || passed === "false" || passed === "fail" || passed === "不合格" ? false : null);

      const pdfBase64 = await buildJlptResultPdf({
        studentName: profile.email.split("@")[0],
        studentEmail: profile.email,
        jlptLevel: String(jlptLevel).trim(),
        passed: passedBool,
        score: score ? String(score).trim() : "",
        testDate: testDate ? String(testDate).trim() : "",
        notes: notes ? String(notes).trim() : "",
      });

      const { error: insertErr } = await supabase.from("jlpt_results").insert({
        student_id: profile.id,
        student_email: profile.email,
        jlpt_level: String(jlptLevel).trim(),
        passed: passedBool,
        score: score ? String(score).trim() : null,
        test_date: testDate ? String(testDate).trim() : null,
        notes: notes ? String(notes).trim() : null,
        pdf_base64: pdfBase64,
        delivered_at: new Date().toISOString(),
      });
      if (insertErr) return res.status(500).json({ error: insertErr.message });

      try {
        await sendEmail({
          to: profile.email,
          subject: "🎓 Your JLPT diagnosis result is ready",
          html: `<p>Hi ${profile.email.split("@")[0]},</p>
            <p>Your JLPT ${String(jlptLevel).trim()} diagnosis result is attached as a PDF.</p>
            <p>You can also view it anytime by logging into your GAKU Master account:</p>
            <p><a href="https://app.seitojapanese.online/app" style="background:#06b6d4;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">Open GAKU Master</a></p>
            <p style="color:#94a3b8;font-size:12px;">— Seito Sakamoto, GAKU Online Japanese</p>`,
          attachments: [{ name: `JLPT_${String(jlptLevel).trim()}_diagnosis.pdf`, base64: pdfBase64 }],
        });
      } catch (emailErr) {
        // Result is already saved and visible in-app even if the notification email fails —
        // don't fail the whole request over a Brevo hiccup.
        console.error("[admin-assign-word/submit_jlpt_result] email failed:", emailErr.message);
      }

      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  try {
    const { secret, studentEmail, word, reading, jlpt, partOfSpeech, meaning, example, folder } = req.body || {};
    if (!secret || secret !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!studentEmail || !word) {
      return res.status(400).json({ error: "studentEmail and word are required" });
    }

    const supabase = getAdminClient();

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("id, email")
      .ilike("email", studentEmail.trim())
      .maybeSingle();
    if (profileErr) return res.status(500).json({ error: profileErr.message });
    if (!profile) {
      return res.status(404).json({ error: "No student found with that email. Make sure they've signed up in GAKU first." });
    }

    // The extension doesn't always send these as strings (e.g. jlpt can come
    // through as a number like 3 instead of "N3"), and calling .trim() on a
    // non-string throws "X.trim is not a function" and 500s the request. This
    // coerces everything to a string first so any value type is safe.
    const toStr = (v) => (v === undefined || v === null ? "" : String(v).trim());

    const { error: insertErr } = await supabase.from("assigned_vocab").insert({
      student_id: profile.id,
      word: toStr(word),
      reading: toStr(reading),
      jlpt: toStr(jlpt),
      part_of_speech: toStr(partOfSpeech),
      meaning: toStr(meaning),
      example: toStr(example),
      folder: toStr(folder) || "Your Vocabulary",
    });
    if (insertErr) return res.status(500).json({ error: insertErr.message });

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
