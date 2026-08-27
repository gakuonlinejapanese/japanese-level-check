import { getAdminClient } from "./_supabaseAdmin.js";

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
