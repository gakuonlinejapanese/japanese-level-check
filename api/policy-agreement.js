import { getAdminClient } from "./_supabaseAdmin.js";
import { sendEmail } from "./_resend.js";
import { ADMIN_EMAIL } from "./_supabaseAdmin.js";

// ---- Free trial lesson: approved-country list (server-side re-check of what
// public/trial-lesson.html already enforces client-side) ----
const TRIAL_ALLOWED_COUNTRIES = new Set([
  "united states", "canada", "united kingdom", "australia", "new zealand", "ireland",
  "singapore", "switzerland", "netherlands", "germany", "denmark", "sweden", "norway",
  "finland", "austria", "belgium", "france", "italy", "spain", "portugal", "israel",
  "luxembourg", "iceland", "czechia", "poland", "slovenia", "estonia", "hong kong",
  "uae", "qatar", "kuwait", "south korea", "taiwan", "bahrain", "oman",
]);

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
// POST { action: "trial_lesson", fullName, email, country, studentTimezone, option1Date,
// option1Time, option2Date, option2Time, option3Date, option3Time, agreed, outcome } —
// called from public/trial-lesson.html, the free-trial-lesson request form. Records the
// submission in `trial_lesson_requests` and emails Seito. outcome is "rejected_country" when
// the applicant's country isn't on the approved list (checked client-side against the same
// list, re-validated here) — the applicant sees a decline screen and never reaches the
// calendar/policy steps; agreed must be true for a non-rejected submission (the policy page
// gates its Agree button behind scrolling through every policy page). Also kept on this same
// endpoint for the same 12-function-cap reason above.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { action } = req.body || {};
    if (action === "cancellation_request") return handleCancellationRequest(req, res);
    if (action === "school_matching") return handleSchoolMatching(req, res);
    if (action === "trial_lesson") return handleTrialLesson(req, res);

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
      fullName, email, country, studentTimezone,
      option1Date, option1Time, option2Date, option2Time, option3Date, option3Time,
      agreed, outcome,
    } = req.body || {};
    if (!fullName || !email) {
      return res.status(400).json({ error: "fullName and email are required" });
    }

    const isRejected = outcome === "rejected_country" || !TRIAL_ALLOWED_COUNTRIES.has((country || "").trim().toLowerCase());
    // A non-rejected submission must have gone through the scroll-gated policy page and
    // ticked Agree — reject the request server-side if that flag is missing, same spirit as
    // the country re-check above (never trust the client alone for a gate like this).
    if (!isRejected && !agreed) {
      return res.status(400).json({ error: "Policy agreement is required" });
    }

    const supabase = getAdminClient();
    const submittedAt = new Date().toISOString();

    const { error: insertErr } = await supabase.from("trial_lesson_requests").insert({
      full_name: fullName,
      email: email.trim().toLowerCase(),
      country: country || null,
      status: isRejected ? "rejected_country" : "new",
      option1_date: option1Date || null, option1_time: option1Time || null,
      option2_date: option2Date || null, option2_time: option2Time || null,
      option3_date: option3Date || null, option3_time: option3Time || null,
      student_timezone: studentTimezone || null,
      agreed_at: isRejected ? null : submittedAt,
      submitted_at: submittedAt,
    });
    if (insertErr) {
      console.error("trial_lesson_requests insert failed:", insertErr.message, insertErr.details || "", insertErr.hint || "");
      return res.status(500).json({ error: insertErr.message });
    }

    const subjectPrefix = isRejected ? "[GAKU] Free Trial Lesson — declined (country)" : "[GAKU] Free Trial Lesson request";
    const optionLines = [
      option1Date ? `First option: ${option1Date} ${option1Time} (${studentTimezone || "JST"})` : null,
      option2Date ? `Second option: ${option2Date} ${option2Time} (${studentTimezone || "JST"})` : null,
      option3Date ? `Third option: ${option3Date} ${option3Time} (${studentTimezone || "JST"})` : null,
    ].filter(Boolean);

    const html = `
      ${isRejected ? `<p style="color:#c8382b;"><strong>Outcome: Declined — country "${country || "(not provided)"}" is not on the approved list. The applicant was shown the decline screen and did not reach the calendar or policy steps.</strong></p>` : ""}
      <p>A student requested a free trial lesson${isRejected ? " (declined before scheduling)" : ""}.</p>
      <p><strong>Name:</strong> ${fullName}<br/>
         <strong>Email:</strong> ${email}<br/>
         <strong>Country:</strong> ${country || "(not provided)"}<br/>
         ${optionLines.length ? `<strong>Preferred times:</strong><br/>${optionLines.join("<br/>")}<br/>` : ""}
         ${!isRejected ? `<strong>Agreed to policy:</strong> Yes<br/>` : ""}
         <strong>Submitted at:</strong> ${submittedAt}</p>
      ${!isRejected ? `<p>Please check your schedule against the preferred times above and confirm the lesson with the student.</p>` : ""}
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
