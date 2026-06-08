import { useState } from "react";

// Replace these with your actual Stripe Payment Links
const STRIPE_LINKS = {
  monthly: "https://buy.stripe.com/YOUR_MONTHLY_LINK",
  quarterly: "https://buy.stripe.com/YOUR_QUARTERLY_LINK",
  annual: "https://buy.stripe.com/YOUR_ANNUAL_LINK",
  trial: "https://www.seitojapanese.online/trial", // Your trial booking link
};

// Valid invitation codes — add student codes here (or fetch from backend)
const VALID_CODES = {
  // "CODE123": "student@email.com",  // Add student codes here
};

export default function PricingPage({ studentData, onClose }) {
  const [view, setView] = useState("main"); // main | free | code | paid
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeSuccess, setCodeSuccess] = useState(false);

  const handleCodeSubmit = () => {
    const email = studentData?.email?.toLowerCase();
    const entry = VALID_CODES[code.toUpperCase()];
    if (!entry) {
      setCodeError("Invalid invitation code. Please check and try again.");
      return;
    }
    if (entry !== email) {
      setCodeError("This code is not linked to your email address.");
      return;
    }
    setCodeSuccess(true);
    setTimeout(() => window.location.href = "/demo-plan.html?unlocked=true", 1500);
  };

  if (view === "free") {
    return (
      <div className="pricing-overlay">
        <div className="pricing-modal free-modal">
          <button className="modal-close" onClick={onClose}>✕</button>
          <div className="free-question">
            <div className="free-icon">🎓</div>
            <h2>Are you a student at GAKU?</h2>
            <p>GAKU lesson students get <strong>free access</strong> to the Self-Study System!</p>
            <div className="free-buttons">
              <button className="btn-yes" onClick={() => setView("code")}>
                Yes, I'm a GAKU student
              </button>
              <button className="btn-no" onClick={() => setView("paid")}>
                No, I'm new to GAKU
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "code") {
    return (
      <div className="pricing-overlay">
        <div className="pricing-modal code-modal">
          <button className="modal-close" onClick={() => setView("free")}>← Back</button>
          <div className="code-section">
            <div className="code-icon">🔑</div>
            <h2>Enter Your Invitation Code</h2>
            <p>Your teacher will give you a personalized code.</p>
            {codeSuccess ? (
              <div className="code-success">
                ✅ Code verified! Unlocking your plan...
              </div>
            ) : (
              <>
                <input
                  className="code-input"
                  type="text"
                  placeholder="e.g. GAKU-XXXX"
                  value={code}
                  onChange={e => { setCode(e.target.value); setCodeError(""); }}
                />
                {codeError && <p className="code-error">⚠️ {codeError}</p>}
                <button className="btn-submit-code" onClick={handleCodeSubmit}>
                  Unlock My Plan →
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (view === "paid") {
    return (
      <div className="pricing-overlay">
        <div className="pricing-modal paid-modal">
          <button className="modal-close" onClick={() => setView("free")}>← Back</button>
          <div className="paid-header">
            <h2>Choose Your Plan</h2>
            <p>Get full access to your personalized GAKU Self-Study System</p>
          </div>
          <div className="plan-grid">
            <PlanCard
              badge=""
              title="Monthly"
              price="$14.99"
              per="/ month"
              features={["Complete Study Plan","To-Do List","Study History","Help Button","Study Time Adjustment","AI Material Generation","AI Review Questions","Goal Achievement Roadmap"]}
              link={STRIPE_LINKS.monthly}
              highlight={false}
            />
            <PlanCard
              badge="POPULAR"
              title="3 Month Plan"
              price="$39"
              per="($13/mo)"
              saving="Save 13%"
              features={["Everything in Monthly","3 months of access","Priority support"]}
              link={STRIPE_LINKS.quarterly}
              highlight={true}
            />
            <PlanCard
              badge="BEST VALUE"
              title="12 Month Plan"
              price="$129"
              per="($10.75/mo)"
              saving="Save 28%"
              features={["Everything in Monthly","12 months of access","Priority support","Annual goal review"]}
              link={STRIPE_LINKS.annual}
              highlight={false}
            />
          </div>
          <div className="trial-section">
            <p>Not sure yet?</p>
            <a href={STRIPE_LINKS.trial} className="btn-trial">
              Book a FREE Trial Lesson →
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Main unlock prompt
  return (
    <div className="pricing-overlay">
      <div className="pricing-modal main-modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="unlock-content">
          <div className="unlock-icon">🔓</div>
          <h2>Would you like to unlock your full plan?</h2>
          <p>Get your complete personalized Japanese study guide with weekly schedules, resources, and AI-generated materials.</p>
          <div className="unlock-buttons">
            <button className="btn-unlock-yes" onClick={() => setView("paid")}>
              Yes, unlock my plan!
            </button>
            <button className="btn-unlock-free" onClick={() => setView("free")}>
              Want to use it for FREE?
            </button>
            <button className="btn-unlock-no" onClick={onClose}>
              No thank you
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ badge, title, price, per, saving, features, link, highlight }) {
  return (
    <div className={`plan-card ${highlight ? "highlight" : ""}`}>
      {badge && <span className="plan-badge">{badge}</span>}
      <div className="plan-title">{title}</div>
      <div className="plan-price">
        {price} <span className="plan-per">{per}</span>
      </div>
      {saving && <div className="plan-saving">🎉 {saving}</div>}
      <ul className="plan-features">
        {features.map(f => <li key={f}>✓ {f}</li>)}
      </ul>
      <a href={link} className="plan-cta" target="_blank" rel="noopener noreferrer">
        Get Started →
      </a>
    </div>
  );
}
