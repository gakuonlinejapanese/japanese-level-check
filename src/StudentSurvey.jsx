import { useState } from "react";

const COUNTRIES = [
  "United States","United Kingdom","Australia","Canada","New Zealand",
  "China","South Korea","Taiwan","Hong Kong","Singapore","Malaysia","Indonesia","Thailand","Vietnam","Philippines","India",
  "Brazil","Mexico","Colombia","Argentina",
  "Germany","France","Italy","Spain","Netherlands","Sweden","Norway","Poland",
  "Saudi Arabia","UAE","Turkey","Egypt",
  "Other"
];

export default function StudentSurvey({ testResult, onComplete }) {
  const [form, setForm] = useState({
    name: "", email: "", country: "",
    goal: "", timeline: "", currentJLPT: "",
    studyPerDay: "", studyPerWeek: ""
  });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    const required = ["name","email","country","goal","timeline","currentJLPT","studyPerDay","studyPerWeek"];
    for (const k of required) {
      if (!form[k]) { setError("Please fill in all fields."); return; }
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) { setError("Please enter a valid email address."); return; }
    setSending(true);
    setError("");

    // Send to teacher via EmailJS
    try {
      const emailBody = {
        service_id: "YOUR_EMAILJS_SERVICE_ID",
        template_id: "YOUR_EMAILJS_TEMPLATE_ID",
        user_id: "YOUR_EMAILJS_PUBLIC_KEY",
        template_params: {
          to_email: "seitojapanese.online@gmail.com",
          student_name: form.name,
          student_email: form.email,
          country: form.country,
          goal: form.goal,
          timeline: form.timeline,
          current_jlpt: form.currentJLPT,
          study_per_day: form.studyPerDay,
          study_per_week: form.studyPerWeek,
          test_score: testResult?.score || "N/A",
          test_level: testResult?.level || "N/A",
        }
      };
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailBody)
      });
    } catch (e) {
      // Non-blocking — continue even if email fails
      console.error("Email send failed:", e);
    }

    onComplete(form);
  };

  return (
    <div className="survey-container">
      <div className="survey-header">
        <div className="survey-icon">🎌</div>
        <h2>Tell Us About You</h2>
        <p>We'll create your personalized Japanese study plan based on your answers.</p>
      </div>

      <div className="survey-fields">
        <Field label="Your Name *">
          <input type="text" placeholder="e.g. Maria" value={form.name}
            onChange={e => set("name", e.target.value)} />
        </Field>

        <Field label="Email Address *">
          <input type="email" placeholder="you@example.com" value={form.email}
            onChange={e => set("email", e.target.value)} />
        </Field>

        <Field label="Which Country? *">
          <select value={form.country} onChange={e => set("country", e.target.value)}>
            <option value="">Select your country...</option>
            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>

        <Field label="What is your final goal? *">
          <div className="radio-group">
            {[
              ["jlpt","Pass JLPT"],
              ["job","Get a job in Japan"],
              ["travel","Travel to Japan"],
              ["study_abroad","Study abroad in Japan"],
              ["other","Other"]
            ].map(([v, label]) => (
              <label key={v} className={`radio-option ${form.goal === v ? "selected" : ""}`}>
                <input type="radio" name="goal" value={v}
                  checked={form.goal === v} onChange={() => set("goal", v)} />
                {label}
              </label>
            ))}
          </div>
        </Field>

        <Field label="When do you want to achieve your goal? *">
          <div className="radio-group">
            {[
              ["under6m","Less than 6 months"],
              ["1year","Within 1 year"],
              ["2_3years","2–3 years"],
              ["over3years","Over 3 years"]
            ].map(([v, label]) => (
              <label key={v} className={`radio-option ${form.timeline === v ? "selected" : ""}`}>
                <input type="radio" name="timeline" value={v}
                  checked={form.timeline === v} onChange={() => set("timeline", v)} />
                {label}
              </label>
            ))}
          </div>
        </Field>

        <Field label="Current JLPT Level *">
          <div className="radio-group horizontal">
            {["N5","N4","N3","N2","N1","No JLPT"].map(v => (
              <label key={v} className={`radio-option ${form.currentJLPT === v ? "selected" : ""}`}>
                <input type="radio" name="jlpt" value={v}
                  checked={form.currentJLPT === v} onChange={() => set("currentJLPT", v)} />
                {v}
              </label>
            ))}
          </div>
        </Field>

        <Field label="How long do you study Japanese per day? *">
          <div className="radio-group">
            {[
              ["under1h","Less than 1 hour"],
              ["1_2h","1–2 hours"],
              ["2_3h","2–3 hours"],
              ["over3h","More than 3 hours"]
            ].map(([v, label]) => (
              <label key={v} className={`radio-option ${form.studyPerDay === v ? "selected" : ""}`}>
                <input type="radio" name="spd" value={v}
                  checked={form.studyPerDay === v} onChange={() => set("studyPerDay", v)} />
                {label}
              </label>
            ))}
          </div>
        </Field>

        <Field label="How many days do you study Japanese per week? *">
          <div className="radio-group">
            {[
              ["once","Once a week or less"],
              ["twice","Twice a week"],
              ["three","Three times a week"],
              ["more","More than three times a week"]
            ].map(([v, label]) => (
              <label key={v} className={`radio-option ${form.studyPerWeek === v ? "selected" : ""}`}>
                <input type="radio" name="spw" value={v}
                  checked={form.studyPerWeek === v} onChange={() => set("studyPerWeek", v)} />
                {label}
              </label>
            ))}
          </div>
        </Field>
      </div>

      {error && <p className="survey-error">⚠️ {error}</p>}

      <button className="survey-submit" onClick={handleSubmit} disabled={sending}>
        {sending ? "Sending..." : "Generate My Study Plan →"}
      </button>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="field-group">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}
