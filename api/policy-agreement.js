import { getAdminClient } from "./_supabaseAdmin.js";
import { sendEmail } from "./_resend.js";
import { ADMIN_EMAIL } from "./_supabaseAdmin.js";

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
// livingExpenses, noScholarship, waitTime, referrer } — called from
// public/school-matching.html, the school-introduction counseling wizard. Records the
// submission in `school_matching_requests` and emails Seito. Also kept on this same
// endpoint for the same 12-function-cap reason above.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { action } = req.body || {};
    if (action === "cancellation_request") return handleCancellationRequest(req, res);
    if (action === "school_matching") return handleSchoolMatching(req, res);

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
      referrer,
    } = req.body || {};
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ error: "firstName, lastName, and email are required" });
    }

    const supabase = getAdminClient();
    const submittedAt = new Date().toISOString();

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
      status: "new",
      submitted_at: submittedAt,
    });
    if (insertErr) {
      console.error("school_matching_requests insert failed:", insertErr.message, insertErr.details || "", insertErr.hint || "");
      return res.status(500).json({ error: insertErr.message });
    }

    const html = `
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
         <strong>Submitted at:</strong> ${submittedAt}</p>
    `;
    try {
      await sendEmail({ to: ADMIN_EMAIL, subject: `[GAKU] School Matching request — ${firstName} ${lastName}`, html });
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
