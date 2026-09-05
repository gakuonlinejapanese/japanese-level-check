import { getAdminClient } from "./_supabaseAdmin.js";
import { sendEmail } from "./_resend.js";
import { ADMIN_EMAIL } from "./_supabaseAdmin.js";

// ---- Free trial lesson: country/city validation (server-side re-check of what
// public/trial-lesson.html already enforces client-side against the free-text
// "Where do you live now?" answer, e.g. "Osaka, Japan" or "Arizona, USA"). Mirrors the
// client's WORLD_COUNTRIES/aliases/analyzeLocation logic exactly — keep both in sync. ----
const WORLD_COUNTRIES = [
  "afghanistan", "albania", "algeria", "andorra", "angola", "antigua and barbuda",
  "argentina", "armenia", "australia", "austria", "azerbaijan", "bahamas",
  "bahrain", "bangladesh", "barbados", "belarus", "belgium", "belize",
  "benin", "bhutan", "bolivia", "bosnia and herzegovina", "botswana", "brazil",
  "brunei", "bulgaria", "burkina faso", "burundi", "cambodia", "cameroon",
  "canada", "cape verde", "central african republic", "chad", "chile", "china",
  "colombia", "comoros", "costa rica", "croatia", "cuba", "cyprus",
  "czech republic", "democratic republic of the congo", "denmark", "djibouti", "dominica", "dominican republic",
  "ecuador", "egypt", "el salvador", "equatorial guinea", "eritrea", "estonia",
  "eswatini", "ethiopia", "fiji", "finland", "france", "gabon",
  "gambia", "georgia", "germany", "ghana", "greece", "grenada",
  "guatemala", "guinea", "guinea-bissau", "guyana", "haiti", "honduras",
  "hong kong", "hungary", "iceland", "india", "indonesia", "iran",
  "iraq", "ireland", "israel", "italy", "ivory coast", "jamaica",
  "japan", "jordan", "kazakhstan", "kenya", "kiribati", "kosovo",
  "kuwait", "kyrgyzstan", "laos", "latvia", "lebanon", "lesotho",
  "liberia", "libya", "liechtenstein", "lithuania", "luxembourg", "macau",
  "madagascar", "malawi", "malaysia", "maldives", "mali", "malta",
  "marshall islands", "mauritania", "mauritius", "mexico", "micronesia", "moldova",
  "monaco", "mongolia", "montenegro", "morocco", "mozambique", "myanmar",
  "namibia", "nauru", "nepal", "netherlands", "new zealand", "nicaragua",
  "niger", "nigeria", "north korea", "north macedonia", "norway", "oman",
  "pakistan", "palau", "palestine", "panama", "papua new guinea", "paraguay",
  "peru", "philippines", "poland", "portugal", "qatar", "republic of the congo",
  "romania", "russia", "rwanda", "saint kitts and nevis", "saint lucia", "saint vincent and the grenadines",
  "samoa", "san marino", "sao tome and principe", "saudi arabia", "senegal", "serbia",
  "seychelles", "sierra leone", "singapore", "slovakia", "slovenia", "solomon islands",
  "somalia", "south africa", "south korea", "south sudan", "spain", "sri lanka",
  "sudan", "suriname", "sweden", "switzerland", "syria", "taiwan",
  "tajikistan", "tanzania", "thailand", "timor-leste", "togo", "tonga",
  "trinidad and tobago", "tunisia", "turkey", "turkmenistan", "tuvalu", "uganda",
  "ukraine", "united arab emirates", "united kingdom", "united states", "uruguay", "uzbekistan",
  "vanuatu", "vatican city", "venezuela", "vietnam", "yemen", "zambia",
  "zimbabwe",
];

const WORLD_COUNTRY_ALIASES = {
  "usa":"united states", "us":"united states", "u s a":"united states",
  "america":"united states", "united states of america":"united states", "uk":"united kingdom",
  "england":"united kingdom", "great britain":"united kingdom", "britain":"united kingdom",
  "scotland":"united kingdom", "wales":"united kingdom", "northern ireland":"united kingdom",
  "uae":"united arab emirates", "emirates":"united arab emirates", "korea":"south korea",
  "republic of korea":"south korea", "rok":"south korea", "hongkong":"hong kong",
  "hong kong sar":"hong kong", "macao":"macau", "czechia":"czech republic",
  "turkiye":"turkey", "nz":"new zealand", "holland":"netherlands",
  "cote d ivoire":"ivory coast", "cote divoire":"ivory coast", "drc":"democratic republic of the congo",
  "dr congo":"democratic republic of the congo", "congo kinshasa":"democratic republic of the congo", "congo brazzaville":"republic of the congo",
  "burma":"myanmar", "swaziland":"eswatini", "russian federation":"russia",
};

const TRIAL_ALLOWED_LIST = [
  "united states", "canada", "united kingdom", "australia", "new zealand", "ireland",
  "singapore", "switzerland", "netherlands", "germany", "denmark", "sweden",
  "norway", "finland", "austria", "belgium", "france", "italy",
  "spain", "portugal", "israel", "luxembourg", "iceland", "czech republic",
  "poland", "slovenia", "estonia", "hong kong", "united arab emirates", "qatar",
  "kuwait", "south korea", "taiwan", "bahrain", "oman", "japan",
];

function normalizeLocationText(s) {
  return (s || "").toLowerCase().replace(/&/g, "and").replace(/[.,]/g, " ").replace(/\s+/g, " ").trim();
}
// All searchable phrases (country names + aliases), longest first so multi-word matches
// (e.g. "south korea") are tried before shorter ones (e.g. "korea") — order barely matters
// for correctness here since they resolve to the same canonical country, but longest-first
// keeps the matched phrase (used to detect leftover "city" text) as specific as possible.
const COUNTRY_LOOKUP = [
  ...WORLD_COUNTRIES.map(c => [c, c]),
  ...Object.entries(WORLD_COUNTRY_ALIASES),
].sort((a, b) => b[0].length - a[0].length);
const TRIAL_ALLOWED_SET = new Set(TRIAL_ALLOWED_LIST);

// Finds a country mention anywhere in the free-text location answer. Returns
// { canonical, matchedPhrase, hasCityText } or null if no country name is found at all.
function analyzeLocation(raw) {
  const norm = normalizeLocationText(raw);
  const padded = " " + norm + " ";
  for (const [phrase, canonical] of COUNTRY_LOOKUP) {
    const needle = " " + phrase + " ";
    if (padded.includes(needle)) {
      const remainder = (padded.split(needle).join(" ")).trim();
      return { canonical, matchedPhrase: phrase, hasCityText: remainder.length > 0 };
    }
  }
  return null;
}


// POST { name, email, plan, userId } (action omitted or "policy_agreement") — called
// right before a student is allowed to proceed to a payment step (either the direct
// Stripe checkout for app-only plans, or the lesson request/application page for plans
// that include lessons). Records the agreement with a timestamp so there's
// a durable record the student did tick "I agree to all terms", and emails
// Seito a copy for their own records.
//
// POST { action: "cancellation_request", requestType, studentName, location, cancelDate,
// returnDate, rescheduleDate } — called from public/cancel-reschedule.html, the combined
// cancel/reschedule form. Records the request in `cancellation_requests` and emails Seito.
// Kept on this same endpoint (rather than a new file) because Vercel's serverless function
// count is already at the 12-function cap.
//
// POST { action: "school_matching", firstName, lastName, email, country, jlptN4,
// longTermTimeline, shortTermTimeline, tuitionAware, shortTermBudget, visaSavings,
// livingExpenses, noScholarship, waitTime, referrer, bankStatementAgree, bankStatementFile,
// outcome } — called from public/school-matching.html, the school-introduction counseling
// wizard. Records the submission in `school_matching_requests` and emails Seito.
// bankStatementFile is { name, mime, base64 } and is only ever emailed as an attachment —
// it is NOT stored in Supabase (no schema change), per Seito's request to keep this to email
// only. outcome is "rejected" when the applicant answered "No" to all four
// tuition/budget/visa/living-expense questions (auto-declined before finishing the wizard);
// otherwise omitted. Also kept on this same endpoint for the same 12-function-cap reason above.
//
// POST { action: "trial_lesson", fullName, email, location, originCountry, preferredDateTime,
// course, japaneseLevel, lessonDuration, agreed, outcome } — called from public/trial-lesson.html,
// the free-trial-lesson request form (fields match Seito's existing "Book a Lesson" form on
// seitojapanese.online: Name, Email, "Where do you live now?", "Preferred Lesson Date/Time",
// course choice, current level, 30-min/1-hour choice). Records the submission in
// `trial_lesson_requests` and emails Seito. outcome is "rejected_country" when the
// applicant's free-text location doesn't match any approved country (checked client-side,
// re-validated here) — the applicant sees a decline screen and never reaches the policy step;
// agreed must be true for a non-rejected submission (the policy page gates its Agree button
// behind paging through every policy page). Also kept on this same endpoint for the same
// 12-function-cap reason above.
//
// POST { action: "admin_list_trial_lessons", secret } — called from
// public/admin-trial-lessons.html. Requires ADMIN_SECRET. Returns { pending, processed }:
// pending = status "new" requests (country-approved, not yet responded to), oldest first;
// processed = the last 30 "accepted"/"declined" requests, most recently responded to first.
//
// POST { action: "admin_respond_trial_lesson", secret, requestId, decision, confirmedDateTime,
// note } — called from public/admin-trial-lessons.html when Seito accepts or declines a
// pending request. decision is "accept" or "decline". Updates the row's status/admin_note/
// confirmed_datetime/responded_at and emails the student the decision plus Seito's note.
// Also kept on this same endpoint for the same 12-function-cap reason above.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { action } = req.body || {};
    if (action === "cancellation_request") return handleCancellationRequest(req, res);
    if (action === "school_matching") return handleSchoolMatching(req, res);
    if (action === "trial_lesson") return handleTrialLesson(req, res);
    if (action === "admin_list_trial_lessons") return handleAdminListTrialLessons(req, res);
    if (action === "admin_respond_trial_lesson") return handleAdminRespondTrialLesson(req, res);

    const { name, email, plan, userId } = req.body || {};
    if (!email) return res.status(400).json({ error: "email is required" });

    const supabase = getAdminClient();
    const agreedAt = new Date().toISOString();

    const { error: insertErr } = await supabase.from("policy_agreements").insert({
      user_id: userId || null,
      name: name || null,
      email: email.trim().toLowerCase(),
      plan: plan || null,
      agreed_at: agreedAt,
    });
    if (insertErr) return res.status(500).json({ error: insertErr.message });

    const html = `
      <p>A student agreed to the GAKU terms just before proceeding to payment.</p>
      <p><strong>Name:</strong> ${name || "(not provided)"}<br/>
         <strong>Email:</strong> ${email}<br/>
         <strong>Plan:</strong> ${plan || "(unspecified)"}<br/>
         <strong>Agreed at:</strong> ${agreedAt}</p>
    `;
    try {
      await sendEmail({ to: ADMIN_EMAIL, subject: "[GAKU] Policy agreement recorded", html });
    } catch (e) {
      // Don't block the student's checkout flow just because the notification email failed —
      // the agreement is already durably recorded in policy_agreements above.
      console.error("Failed to send policy-agreement notification email:", e.message);
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

async function handleCancellationRequest(req, res) {
  try {
    const { requestType, studentName, location, cancelDate, returnDate, rescheduleDate } = req.body || {};
    if (!requestType || !["cancel", "reschedule"].includes(requestType)) {
      return res.status(400).json({ error: "requestType must be 'cancel' or 'reschedule'" });
    }
    if (!studentName || !cancelDate) {
      return res.status(400).json({ error: "studentName and cancelDate are required" });
    }

    const supabase = getAdminClient();
    const createdAt = new Date().toISOString();

    const { error: insertErr } = await supabase.from("cancellation_requests").insert({
      request_type: requestType,
      student_name: studentName,
      location: location || null,
      cancel_date: cancelDate,
      return_date: returnDate || null,
      reschedule_date: rescheduleDate || null,
      created_at: createdAt,
    });
    if (insertErr) return res.status(500).json({ error: insertErr.message });

    const isCancel = requestType === "cancel";
    const html = `
      <p>A student submitted a ${isCancel ? "cancellation" : "reschedule"} request.</p>
      <p><strong>Type:</strong> ${isCancel ? "Cancel" : "Reschedule"}<br/>
         <strong>Name:</strong> ${studentName}<br/>
         ${location ? `<strong>Location:</strong> ${location}<br/>` : ""}
         <strong>Lesson date being canceled:</strong> ${cancelDate}<br/>
         ${returnDate ? `<strong>Returning on:</strong> ${returnDate}<br/>` : ""}
         ${rescheduleDate ? `<strong>Preferred reschedule date:</strong> ${rescheduleDate}<br/>` : ""}
         <strong>Submitted at:</strong> ${createdAt}</p>
    `;
    try {
      await sendEmail({
        to: ADMIN_EMAIL,
        subject: `[GAKU] ${isCancel ? "Cancellation" : "Reschedule"} request — ${studentName}`,
        html,
      });
    } catch (e) {
      // Don't block the student's submission just because the notification email failed —
      // the request is already durably recorded in cancellation_requests above.
      console.error("Failed to send cancellation-request notification email:", e.message);
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

async function handleSchoolMatching(req, res) {
  try {
    const {
      firstName, lastName, email, country, jlptN4, longTermTimeline, shortTermTimeline,
      tuitionAware, shortTermBudget, visaSavings, livingExpenses, noScholarship, waitTime,
      referrer, bankStatementAgree, bankStatementFile, outcome,
    } = req.body || {};
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: "firstName, lastName, and email are required" });
    }

    // Guard against oversized payloads reaching here (Vercel's request body limit is ~4.5MB;
    // base64 inflates size ~33%, so a 3MB file is already ~4MB encoded). The client also caps
    // uploads at 3MB, but this is a second line of defense.
    if (bankStatementFile?.base64 && bankStatementFile.base64.length > 4_000_000) {
      return res.status(413).json({ error: "Attachment too large" });
    }

    const supabase = getAdminClient();
    const submittedAt = new Date().toISOString();

    const isRejected = outcome === "rejected" || outcome === "rejected_country";
    const rejectionReason = outcome === "rejected_country"
      ? "Country not currently supported"
      : outcome === "rejected"
        ? "Finance readiness answers"
        : null;

    const { error: insertErr } = await supabase.from("school_matching_requests").insert({
      first_name: firstName,
      last_name: lastName,
      email: email.trim().toLowerCase(),
      country: country || null,
      jlpt_n4: jlptN4 || null,
      long_term_timeline: longTermTimeline || null,
      short_term_timeline: shortTermTimeline || null,
      tuition_aware: tuitionAware || null,
      short_term_budget: shortTermBudget || null,
      visa_savings: visaSavings || null,
      living_expenses: livingExpenses || null,
      no_scholarship_ack: noScholarship || null,
      wait_time_ack: waitTime || null,
      referrer: referrer || null,
      status: isRejected ? "rejected" : "new",
      submitted_at: submittedAt,
    });
    if (insertErr) {
      console.error("school_matching_requests insert failed:", insertErr.message, insertErr.details || "", insertErr.hint || "");
      return res.status(500).json({ error: insertErr.message });
    }

    const subjectPrefix = isRejected ? "[GAKU] School Matching — no match" : "[GAKU] School Matching request";

    const html = `
      ${isRejected ? `<p style="color:#c8382b;"><strong>Outcome: No school matched (auto-declined)${rejectionReason ? ` — reason: ${rejectionReason}` : ""} — the applicant was shown "Unfortunately there is no school we can provide for you" and did not continue past this point.</strong></p>` : ""}
      <p>A student submitted a School Matching counseling request.</p>
      <p><strong>Name:</strong> ${firstName} ${lastName}<br/>
         <strong>Email:</strong> ${email}<br/>
         <strong>Country:</strong> ${country || "(not provided)"}<br/>
         <strong>JLPT N4+:</strong> ${jlptN4 || "-"}<br/>
         <strong>Long-term timeline OK:</strong> ${longTermTimeline || "-"}<br/>
         <strong>Short-term timeline OK:</strong> ${shortTermTimeline || "-"}<br/>
         <strong>Tuition aware (¥1,148,000+):</strong> ${tuitionAware || "-"}<br/>
         <strong>Short-term budget fits (¥340,000):</strong> ${shortTermBudget || "-"}<br/>
         <strong>Visa savings (¥2,000,000) met:</strong> ${visaSavings || "-"}<br/>
         <strong>Living expenses ready:</strong> ${livingExpenses || "-"}<br/>
         <strong>No-scholarship acknowledged:</strong> ${noScholarship || "-"}<br/>
         <strong>Wait-time acknowledged:</strong> ${waitTime || "-"}<br/>
         ${bankStatementAgree ? `<strong>Bank statement request:</strong> ${bankStatementAgree}<br/>` : ""}
         ${bankStatementFile?.name ? `<strong>Bank statement file:</strong> attached (${bankStatementFile.name})<br/>` : ""}
         <strong>Submitted at:</strong> ${submittedAt}</p>
    `;
    try {
      const attachments = bankStatementFile?.base64
        ? [{ name: bankStatementFile.name || "bank-statement.pdf", base64: bankStatementFile.base64 }]
        : undefined;
      // Applicants who cleared every condition (not rejected) also go to info@glocaljp.com,
      // in addition to the usual ADMIN_EMAIL notification. Rejected/no-match submissions keep
      // going to ADMIN_EMAIL only.
      const recipients = isRejected ? ADMIN_EMAIL : [ADMIN_EMAIL, "info@glocaljp.com"];
      await sendEmail({ to: recipients, subject: `${subjectPrefix} — ${firstName} ${lastName}`, html, attachments, replyTo: email });
    } catch (e) {
      // Don't block the student's submission just because the notification email failed —
      // the request is already durably recorded in school_matching_requests above.
      console.error("Failed to send school-matching notification email:", e.message);
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("handleSchoolMatching failed:", e.message);
    return res.status(500).json({ error: e.message });
  }
}

async function handleTrialLesson(req, res) {
  try {
    const {
      fullName, email, location, originCountry, preferredDateTime, course, japaneseLevel, lessonDuration,
      agreed, outcome,
    } = req.body || {};
    if (!fullName || !email) {
      return res.status(400).json({ error: "fullName and email are required" });
    }

    const analysis = analyzeLocation(location);
    const isRejected = outcome === "rejected_country" || !analysis || !analysis.hasCityText || !TRIAL_ALLOWED_SET.has(analysis.canonical);
    // A non-rejected submission must have gone through the page-gated policy step and
    // ticked Agree — reject the request server-side if that flag is missing, same spirit as
    // the location re-check above (never trust the client alone for a gate like this).
    if (!isRejected && !agreed) {
      return res.status(400).json({ error: "Policy agreement is required" });
    }

    const supabase = getAdminClient();
    const submittedAt = new Date().toISOString();

    const { error: insertErr } = await supabase.from("trial_lesson_requests").insert({
      full_name: fullName,
      email: email.trim().toLowerCase(),
      location: location || null,
      origin_country: originCountry || null,
      status: isRejected ? "rejected_country" : "new",
      preferred_datetime: preferredDateTime || null,
      course: course || null,
      japanese_level: japaneseLevel || null,
      lesson_duration: lessonDuration || null,
      agreed_at: isRejected ? null : submittedAt,
      submitted_at: submittedAt,
    });
    if (insertErr) {
      console.error("trial_lesson_requests insert failed:", insertErr.message, insertErr.details || "", insertErr.hint || "");
      return res.status(500).json({ error: insertErr.message });
    }

    const subjectPrefix = isRejected ? "[GAKU] Free Trial Lesson — declined (country)" : "[GAKU] Free Trial Lesson request";

    const html = `
      ${isRejected ? `<p style="color:#c8382b;"><strong>Outcome: Declined — location "${location || "(not provided)"}" did not match any approved country. The applicant was shown the decline screen and did not reach the policy step.</strong></p>` : ""}
      <p>A student requested a free trial lesson${isRejected ? " (declined before scheduling)" : ""}.</p>
      <p><strong>Name:</strong> ${fullName}<br/>
         <strong>Email:</strong> ${email}<br/>
         <strong>Where they live:</strong> ${location || "(not provided)"}<br/>
         ${originCountry ? `<strong>Origin country:</strong> ${originCountry}<br/>` : ""}
         ${preferredDateTime ? `<strong>Preferred lesson date/time:</strong> ${preferredDateTime}<br/>` : ""}
         ${course ? `<strong>Course:</strong> ${course}<br/>` : ""}
         ${japaneseLevel ? `<strong>Current Japanese level:</strong> ${japaneseLevel}<br/>` : ""}
         ${lessonDuration ? `<strong>Lesson length:</strong> ${lessonDuration}<br/>` : ""}
         ${!isRejected ? `<strong>Agreed to policy:</strong> Yes<br/>` : ""}
         <strong>Submitted at:</strong> ${submittedAt}</p>
      ${!isRejected ? `<p>Please check your schedule against the preferred date/time above, then accept or decline (with an optional note) from the admin page: <a href="https://app.seitojapanese.online/admin-trial-lessons.html">admin-trial-lessons.html</a>.</p>` : ""}
    `;
    try {
      await sendEmail({ to: ADMIN_EMAIL, subject: `${subjectPrefix} — ${fullName}`, html, replyTo: email });
    } catch (e) {
      // Don't block the student's submission just because the notification email failed —
      // the request is already durably recorded in trial_lesson_requests above.
      console.error("Failed to send trial-lesson notification email:", e.message);
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("handleTrialLesson failed:", e.message);
    return res.status(500).json({ error: e.message });
  }
}

function checkAdminSecret(req) {
  return req.body?.secret && req.body.secret === process.env.ADMIN_SECRET;
}

async function handleAdminListTrialLessons(req, res) {
  if (!checkAdminSecret(req)) return res.status(401).json({ error: "Invalid admin secret" });
  try {
    const supabase = getAdminClient();
    const { data: pending, error: pendingErr } = await supabase
      .from("trial_lesson_requests")
      .select("*")
      .eq("status", "new")
      .order("submitted_at", { ascending: true });
    if (pendingErr) return res.status(500).json({ error: pendingErr.message });

    const { data: processed, error: processedErr } = await supabase
      .from("trial_lesson_requests")
      .select("*")
      .in("status", ["accepted", "declined"])
      .order("responded_at", { ascending: false })
      .limit(30);
    if (processedErr) return res.status(500).json({ error: processedErr.message });

    return res.status(200).json({ pending: pending || [], processed: processed || [] });
  } catch (e) {
    console.error("handleAdminListTrialLessons failed:", e.message);
    return res.status(500).json({ error: e.message });
  }
}

async function handleAdminRespondTrialLesson(req, res) {
  if (!checkAdminSecret(req)) return res.status(401).json({ error: "Invalid admin secret" });
  try {
    const { requestId, decision, confirmedDateTime, note } = req.body || {};
    if (!requestId || !["accept", "decline"].includes(decision)) {
      return res.status(400).json({ error: "requestId and a valid decision (accept/decline) are required" });
    }

    const supabase = getAdminClient();
    const { data: existing, error: fetchErr } = await supabase
      .from("trial_lesson_requests")
      .select("*")
      .eq("id", requestId)
      .single();
    if (fetchErr || !existing) return res.status(404).json({ error: "Request not found" });

    const respondedAt = new Date().toISOString();
    const newStatus = decision === "accept" ? "accepted" : "declined";
    const { error: updateErr } = await supabase
      .from("trial_lesson_requests")
      .update({
        status: newStatus,
        admin_note: note || null,
        confirmed_datetime: decision === "accept" ? (confirmedDateTime || existing.preferred_datetime || null) : null,
        responded_at: respondedAt,
      })
      .eq("id", requestId);
    if (updateErr) return res.status(500).json({ error: updateErr.message });

    const isAccept = decision === "accept";
    const html = `
      <p>Hi ${existing.full_name},</p>
      ${isAccept
        ? `<p>Great news — your free trial lesson request has been <strong>confirmed</strong> for:</p>
           <p style="font-size:16px;"><strong>${confirmedDateTime || existing.preferred_datetime || "(to be confirmed)"}</strong> (your local time)</p>`
        : `<p>Thank you for your interest in a free trial lesson. Unfortunately, the teacher isn't able to offer the requested time, and we're not able to arrange your free trial lesson at this time.</p>`
      }
      ${note ? `<p><strong>A note from your teacher:</strong><br/>${note.replace(/\n/g, "<br/>")}</p>` : ""}
      ${isAccept ? `<p>If you have any questions before the lesson, feel free to reply to this email.</p>` : `<p>If you'd like to try again with a different time, feel free to reply to this email or submit a new request.</p>`}
      <p>— GAKU Online Japanese</p>
    `;
    try {
      await sendEmail({
        to: existing.email,
        subject: isAccept ? "[GAKU] Your Free Trial Lesson is confirmed!" : "[GAKU] About your Free Trial Lesson request",
        html,
        replyTo: ADMIN_EMAIL,
      });
    } catch (e) {
      console.error("Failed to send trial-lesson response email:", e.message);
      // The decision is already saved — surface the email failure so Seito knows to follow
      // up manually, but don't treat the whole action as failed.
      return res.status(200).json({ ok: true, emailFailed: true });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("handleAdminRespondTrialLesson failed:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
