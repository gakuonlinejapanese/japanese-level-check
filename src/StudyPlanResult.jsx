import { useState } from "react";
import PricingPage from "./PricingPage";
import StudyGuidePreview from "./StudyGuidePreview";

// Map student answers → CEFR level
function getCEFR(jlpt) {
  const map = { "N5": "A1", "N4": "A2", "N3": "B1", "N2": "B2", "N1": "C1", "No JLPT": "A1" };
  return map[jlpt] || "A2";
}

function getRecommendedResources(studentData) {
  const { currentJLPT, studyPerDay, goal } = studentData;
  const level = currentJLPT || "N4";
  const isBeginnerLevel = ["N5","N4","No JLPT"].includes(level);
  const isAdvanced = ["N2","N1"].includes(level);

  const resources = [];

  // Pronunciation / basics
  if (isBeginnerLevel) {
    resources.push({
      icon: "🔤",
      name: "Anki – Beginner Deck",
      desc: "Free · Master hiragana, katakana and basic vocabulary.",
      link: "https://ankiweb.net/shared/decks?search=japanese+n5"
    });
    resources.push({
      icon: "🎵",
      name: "NHK World Japanese Lessons",
      desc: "Free · Great for absolute beginners. Audio + text lessons.",
      link: "https://www3.nhk.or.jp/nhkworld/lesson/en/lessons/"
    });
  } else {
    resources.push({
      icon: "📱",
      name: `Anki – JLPT ${level} Deck`,
      desc: "Free · Best for vocabulary retention. Study every day, even just 10 minutes.",
      link: `https://ankiweb.net/shared/decks?search=jlpt+${level.toLowerCase()}`
    });
  }

  // Grammar
  resources.push({
    icon: "🌐",
    name: "Bunpro",
    desc: "$3/month · SRS-based grammar study. Follow the " + level + " path strictly.",
    link: "https://bunpro.jp"
  });

  // Reading
  if (!isBeginnerLevel) {
    resources.push({
      icon: "📰",
      name: "NHK Web Easy",
      desc: "Free · Real Japanese news simplified for learners. Perfect for " + level + " level.",
      link: "https://news.web.nhk/news/easy/"
    });
  } else {
    resources.push({
      icon: "📖",
      name: "Tadoku (Free Reading)",
      desc: "Free · Graded reading material starting from beginner level.",
      link: "https://tadoku.org/japanese/book-search/?level=&order=register_desc"
    });
  }

  // JLPT practice
  resources.push({
    icon: "📝",
    name: "JapaneseTest4You",
    desc: "Free · JLPT practice questions and mock tests.",
    link: "https://japanesetest4you.com/"
  });

  // Conversation
  resources.push({
    icon: "💬",
    name: "Marugoto Online",
    desc: "Free · Communicative approach. Speaking and listening practice.",
    link: "https://a1.marugotoweb.jp/en/"
  });

  // Job/business goal
  if (goal === "job") {
    resources.push({
      icon: "💼",
      name: "GAKU Business Japanese",
      desc: "Live lessons · Focus on keigo and workplace Japanese with a native teacher.",
      link: "https://www.seitojapanese.online/"
    });
  }

  // Kanji
  if (isAdvanced || level === "N3") {
    resources.push({
      icon: "🈴",
      name: "Imabi – Advanced Grammar",
      desc: "Free · Deep grammar explanations for N3–N1 level.",
      link: "https://imabi.org/"
    });
  }

  return resources;
}

function getGoalLabel(goal) {
  const map = {
    jlpt: "Pass JLPT",
    job: "Work in Japan",
    travel: "Travel to Japan",
    study_abroad: "Study Abroad in Japan",
    other: "Your Japanese Goal"
  };
  return map[goal] || goal;
}

function getTimelineLabel(t) {
  const map = {
    under6m: "less than 6 months",
    "1year": "within 1 year",
    "2_3years": "in 2–3 years",
    over3years: "in over 3 years"
  };
  return map[t] || t;
}

export default function StudyPlanResult({ studentData, testResult }) {
  const [showPricing, setShowPricing] = useState(false);
  const [showGuidePreview, setShowGuidePreview] = useState(false);
  const [unlocked] = useState(
    new URLSearchParams(window.location.search).get("unlocked") === "true"
  );

  const cefrLevel = getCEFR(studentData?.currentJLPT);
  const resources = getRecommendedResources(studentData || {});
  const name = studentData?.name || "Student";
  const goalLabel = getGoalLabel(studentData?.goal);
  const timelineLabel = getTimelineLabel(studentData?.timeline);

  const PLAN_PREVIEW = `
## ${name}'s Japanese Study Plan
**Level:** ${cefrLevel} / JLPT ${studentData?.currentJLPT || "N4"}
**Goal:** ${goalLabel}
**Timeline:** ${timelineLabel}

### Week 1–2: Foundation
- Review all hiragana & katakana (daily 10 min)
- Start Anki vocabulary deck: 15 new cards/day
- Begin Bunpro grammar: 2 new points per session

### Week 3–4: Build Momentum
- Grammar practice: 3 sessions/week on Bunpro
- Vocabulary: Increase to 20 new Anki cards/day
- Reading: 1 NHK Web Easy article per session

### Month 2: Real Content
- Shadow native audio 15 min/day
- Write one short Japanese journal entry per week
- Complete 1 practice JLPT section per week
  `.trim();

  const BLURRED_CONTENT = `
### Month 3–4: Accelerate
...full schedule with daily tasks and timings...

### Month 5–6: Advanced
...business Japanese, keigo, interview prep...

### Milestone Tests
...practice test schedule and scoring targets...

### Vocabulary Targets
...specific word lists by topic and frequency...

### Speaking Practice Templates
...scripts, shadowing tracks and conversation guides...
  `.trim();

  if (showGuidePreview) {
    return (
      <StudyGuidePreview
        onBack={() => setShowGuidePreview(false)}
        onNext={() => setShowPricing(true)}
      />
    );
  }

  return (
    <div className="plan-result-page">
      {showPricing && (
        <PricingPage
          studentData={studentData}
          onClose={() => setShowPricing(false)}
        />
      )}

      {/* Header */}
      <div className="plan-result-header">
        <div className="plan-result-badge">✅ UNLOCKED — PERSONALIZED STUDY PLAN</div>
        <h1>{name}'s Japanese Study Plan</h1>
        <p>Generated for: <strong>{name}</strong> · Level: <strong>{cefrLevel} ({studentData?.currentJLPT || "N4"})</strong></p>
      </div>

      {/* Profile summary */}
      <div className="profile-card">
        <h3>📊 YOUR PROFILE</h3>
        <div className="profile-grid">
          <div className="profile-item"><span>Current Level</span><strong>{cefrLevel} / JLPT {studentData?.currentJLPT}</strong></div>
          <div className="profile-item"><span>Goal</span><strong>{goalLabel}</strong></div>
          <div className="profile-item"><span>Target</span><strong>{timelineLabel}</strong></div>
          <div className="profile-item"><span>Study time</span><strong>{studentData?.studyPerDay?.replace("_","-").replace("1h","1 hr").replace("2h","2 hrs").replace("3h","3 hrs").replace("under","< ").replace("over","> ")}/day</strong></div>
        </div>
      </div>

      {/* Plan preview — first part visible */}
      <div className="plan-preview-section">
        <h3>🎯 YOUR STUDY PLAN</h3>
        <pre className="plan-text visible-plan">{PLAN_PREVIEW}</pre>

        {/* Blurred section */}
        {!unlocked && (
          <div className="blurred-section-wrapper">
            <pre className="plan-text blurred-plan">{BLURRED_CONTENT}</pre>
            <div className="blur-overlay">
              <div className="blur-cta">
                <div className="lock-icon">🔒</div>
                <p>The full plan continues here...</p>
                <button className="btn-unlock-main" onClick={() => setShowPricing(true)}>
                  Would you like to unlock?
                </button>
                <div className="free-option">
                  <p>or</p>
                  <button className="btn-free-main" onClick={() => setShowPricing(true)}>
                    Want to use it for FREE?
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resources — always visible */}
      <div className="resources-section">
        <h3>📚 TOP RECOMMENDED RESOURCES</h3>
        <p className="resources-sub">Tailored to your level ({cefrLevel}) and study schedule</p>
        <div className="resources-grid">
          {resources.map((r, i) => (
            <a key={i} href={r.link} target="_blank" rel="noopener noreferrer" className="resource-card">
              <span className="resource-icon">{r.icon}</span>
              <div>
                <div className="resource-name">{r.name}</div>
                <div className="resource-desc">{r.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Motivational footer */}
      <div className="motivation-section">
        <div className="motivation-flower">🌸</div>
        <h3>You've got this!</h3>
        <p>
          Your goal of <strong>{goalLabel}</strong> {timelineLabel} is absolutely achievable
          at your current level. Stay consistent, enjoy the journey, and remember — every
          kanji you learn brings you one step closer to your dream.{" "}
          <strong>頑張ってください！</strong>
        </p>
        <p className="motivation-sub">Want personalized feedback from a native Japanese teacher?</p>
        <a href="https://www.seitojapanese.online/" className="btn-trial-footer">
          Book a FREE Trial Lesson →
        </a>
        <br />
        <button className="btn-self-study-footer" onClick={() => setShowGuidePreview(true)}>
          Start my self study!! 📖
        </button>
      </div>
    </div>
  );
}
