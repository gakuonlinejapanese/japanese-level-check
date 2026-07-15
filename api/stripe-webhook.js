import Stripe from "stripe";
import { getAdminClient } from "./_supabaseAdmin.js";
import { sendEmail } from "./_resend.js";

const APP_URL = "https://app.seitojapanese.online/app";

function loginLinkReminderHtml() {
  return `
    <div style="font-family: Arial, sans-serif; font-size: 15px; color: #222; line-height: 1.6;">
      <p>Thank you for your payment! Your GAKU account is now active.</p>
      <p>Bookmark this link so you can always get back to your dashboard:</p>
      <p style="margin: 20px 0;">
        <a href="${APP_URL}" style="background: #019bd7; color: #fff; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Go to my GAKU dashboard</a>
      </p>
      <p>Or copy this link directly:<br/><a href="${APP_URL}">${APP_URL}</a></p>
      <p>See you inside,<br/>GAKU Online Japanese</p>
    </div>
  `;
}

// Stripe needs the RAW request body to verify the webhook signature, so we
// must disable Vercel's default JSON body parsing for this route.
export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeSecret || !webhookSecret) {
    console.error("Stripe env vars missing (STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET)");
    return res.status(500).json({ error: "Stripe is not configured on the server." });
  }
  const stripe = new Stripe(stripeSecret);

  let event;
  try {
    const rawBody = await readRawBody(req);
    const signature = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // We attach the logged-in student's Supabase user id as client_reference_id
      // when opening the Stripe Payment Link (see GakuApp.jsx), so we know
      // exactly which profile to unlock — no email-matching guesswork.
      const userId = session.client_reference_id;
      const amountTotal = session.amount_total; // in the smallest currency unit
      const currency = session.currency;
      const planLabel = amountTotal != null && currency ? `${(amountTotal / 100).toFixed(2)} ${currency.toUpperCase()}` : null;

      if (userId) {
        const supabase = getAdminClient();
        const { error } = await supabase
          .from("profiles")
          .update({ is_paid: true, paid_plan: planLabel, paid_at: new Date().toISOString() })
          .eq("id", userId);
        if (error) console.error("Failed to mark profile as paid:", error.message);

        // One-time "bookmark your dashboard" reminder email, sent once per
        // successful payment. Uses the account's own profile email (not the
        // Stripe checkout email field) so the link matches the login the
        // student actually uses.
        try {
          const { data: profile, error: profileFetchError } = await supabase
            .from("profiles")
            .select("email")
            .eq("id", userId)
            .single();
          if (profileFetchError) {
            console.error("Could not fetch profile email for login-link reminder:", profileFetchError.message);
          } else if (profile?.email) {
            await sendEmail({
              to: profile.email,
              subject: "Your GAKU dashboard link (bookmark this!)",
              html: loginLinkReminderHtml(),
            });
            console.log("Login-link reminder email SENT OK to", profile.email);
          }
        } catch (emailErr) {
          console.error("Login-link reminder email FAILED:", emailErr.message);
        }
      } else {
        console.error("checkout.session.completed had no client_reference_id — cannot link payment to an account.");
      }
    }
    return res.status(200).json({ received: true });
  } catch (e) {
    console.error("Stripe webhook handler error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
