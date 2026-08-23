import { getAdminClient } from "./_supabaseAdmin.js";
import { computeTrialFields } from "./_trialStatus.js";

// POST branch below (GAKU Reader install/check-in log, plus trial-status
// lookup by email) is kept in this file rather than its own serverless
// function to stay under Vercel's 12-function cap (see api/ directory —
// already at 12). GET below is the original, unrelated Wikimedia Commons
// image search used by the vocab image picker.
export default async function handler(req, res) {
  if (req.method === "POST") {
    // The extension calls this cross-origin, so it needs a CORS preflight.
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    try {
      const { instanceId, userId, email, isGakuStudent, isPaid, trialExpired, browserInfo } = req.body || {};
      if (!instanceId) return res.status(400).json({ error: "instanceId is required" });
      const supabase = getAdminClient();

      // The extension now requires students to enter their GAKU login email
      // in its settings (closes the loophole where a student who never
      // opens the GAKU app tab in that browser could never be identified or
      // trial-gated). When an email is present, look the account up
      // directly and compute authoritative trial status server-side —
      // independent of whether a GAKU tab happens to be open.
      let trialStatus = null;
      let resolvedUserId = userId || null;
      if (email) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, is_gaku_student, is_paid, trial_started_at")
          .ilike("email", email.trim())
          .maybeSingle();
        if (profile) {
          resolvedUserId = profile.id;
          trialStatus = { found: true, userId: profile.id, ...computeTrialFields(profile) };
        } else {
          trialStatus = { found: false };
        }
      }

      const { error } = await supabase.from("reader_install_log").upsert(
        {
          instance_id: instanceId,
          user_id: resolvedUserId,
          email: email || null,
          is_gaku_student: trialStatus ? !!trialStatus.isGakuStudent : !!isGakuStudent,
          is_paid: trialStatus ? !!trialStatus.isPaid : !!isPaid,
          trial_expired: trialStatus ? !!trialStatus.trialExpired : !!trialExpired,
          browser_info: browserInfo || null,
          last_seen: new Date().toISOString(),
        },
        { onConflict: "instance_id" }
      );
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ ok: true, trialStatus });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { q, page = 0 } = req.query;
  if (!q) return res.status(400).json({ error: "Query required" });

  try {
    // Search Wikimedia Commons for images
    const offset = parseInt(page) * 10;
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=10&gsroffset=${offset}&prop=imageinfo&iiprop=url|size&iiurlwidth=400&format=json&origin=*`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    const pages = data?.query?.pages || {};
    const images = Object.values(pages)
      .map(p => p?.imageinfo?.[0]?.thumburl)
      .filter(Boolean);

    return res.status(200).json({ images });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
