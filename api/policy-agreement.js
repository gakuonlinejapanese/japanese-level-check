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
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { action } = req.body || {};
    if (action === "cancellation_request") return handleCancellationRequest(req, res);

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
