import { useState, useEffect } from "react";

const STEPS = [
  { text: "GAKU is generating your questions...", duration: 1800 },
  { text: "Analyzing your Japanese level...", duration: 1800 },
  { text: "Generating your CEFR level...", duration: 1600 },
  { text: "Almost there...", duration: 1200 },
  { text: "DONE!!", duration: 600 },
];

export default function LoadingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let totalElapsed = 0;
    const totalTime = STEPS.reduce((sum, s) => sum + s.duration, 0);
    const interval = setInterval(() => {
      totalElapsed += 50;
      setProgress(Math.min((totalElapsed / totalTime) * 100, 100));
    }, 50);

    let delay = 0;
    STEPS.forEach((s, i) => {
      setTimeout(() => setStep(i), delay);
      delay += s.duration;
    });

    const timer = setTimeout(() => {
      clearInterval(interval);
      onComplete();
    }, delay + 200);

    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [onComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <span className="loading-gaku">GAKU</span>
          <span className="loading-ai">AI</span>
        </div>

        <div className="loading-orb">
          <div className="orb-ring ring1"></div>
          <div className="orb-ring ring2"></div>
          <div className="orb-ring ring3"></div>
          <div className="orb-core">
            {step === STEPS.length - 1 ? "✓" : "🤖"}
          </div>
        </div>

        <div className="loading-message">
          {STEPS[step]?.text}
        </div>

        <div className="loading-bar-wrap">
          <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="loading-dots">
          {step < STEPS.length - 1 && (
            <>
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
