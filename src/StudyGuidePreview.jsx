import { useState } from "react";

const SLIDES = [
  {
    icon: "🗺️",
    title: "Your Personal Roadmap to Japanese",
    subtitle: "What's inside your Self-Study Guide",
    body: "Based on your test results and goals, GAKU AI generates a fully personalized Japanese study plan — your own roadmap from where you are now to where you want to be. No generic plans. Just yours.",
    visual: (
      <div className="slide-visual roadmap">
        <div className="roadmap-item active">📍 Your Current Level (A2)</div>
        <div className="roadmap-arrow">↓</div>
        <div className="roadmap-item">🎯 N3 in 4 months</div>
        <div className="roadmap-arrow">↓</div>
        <div className="roadmap-item">🏆 N2 · Work in Japan</div>
      </div>
    )
  },
  {
    icon: "📅",
    title: "Weekly Schedule + To-Do List",
    subtitle: "Study smarter, not harder",
    body: "Your guide includes a week-by-week schedule tailored to your available study time. Each day has a To-Do list — check items off as you complete them. Stuck? Hit the Help button and GAKU adjusts your plan to match your mood and energy.",
    visual: (
      <div className="slide-visual schedule">
        <div className="schedule-day">
          <span className="day-name">Monday</span>
          <div className="todo-items">
            <div className="todo-item checked">✅ Bunpro Grammar (30 min)</div>
            <div className="todo-item">☐ Anki Vocabulary (20 min)</div>
          </div>
        </div>
        <div className="schedule-day">
          <span className="day-name">Tuesday</span>
          <div className="todo-items">
            <div className="todo-item">☐ NHK Web Easy (25 min)</div>
            <div className="todo-item">☐ Shadowing practice (15 min)</div>
          </div>
        </div>
        <div className="help-badge">🆘 Need help? → Tap Help!</div>
      </div>
    )
  },
  {
    icon: "📚",
    title: "Curated Resources + AI-Generated Materials",
    subtitle: "Everything you need in one place",
    body: "Get hand-picked learning resources matched to your exact level and goal — from free sites to proven apps. Plus, GAKU AI generates custom review questions and materials just for you, so you're always challenged at the right level.",
    visual: (
      <div className="slide-visual resources">
        <div className="resource-item">📱 <strong>Anki</strong> · Vocabulary flashcards</div>
        <div className="resource-item">🌐 <strong>Bunpro</strong> · Grammar SRS</div>
        <div className="resource-item">📰 <strong>NHK Web Easy</strong> · Real news</div>
        <div className="resource-item ai-item">🤖 <strong>AI Review Questions</strong> · Generated for you</div>
      </div>
    )
  }
];

export default function StudyGuidePreview({ onNext, onBack }) {
  const [slide, setSlide] = useState(0);

  const isLast = slide === SLIDES.length - 1;
  const current = SLIDES[slide];

  return (
    <div className="guide-preview-container">
      <div className="guide-preview-header">
        <h2>✨ Your Self-Study Guide Preview</h2>
        <p>Here's what you'll get when you unlock your plan</p>
      </div>

      <div className="guide-slide">
        <div className="slide-icon">{current.icon}</div>
        <h3 className="slide-title">{current.title}</h3>
        <p className="slide-subtitle">{current.subtitle}</p>
        <p className="slide-body">{current.body}</p>
        {current.visual}
      </div>

      <div className="slide-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`slide-dot ${i === slide ? "active" : ""}`}
            onClick={() => setSlide(i)}
          />
        ))}
      </div>

      <div className="slide-nav">
        <button
          className="slide-btn back"
          onClick={() => slide === 0 ? onBack() : setSlide(slide - 1)}
        >
          ← Back
        </button>

        {isLast ? (
          <button className="slide-btn cta" onClick={onNext}>
            Let's get my study guide! 🚀
          </button>
        ) : (
          <button className="slide-btn next" onClick={() => setSlide(slide + 1)}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
