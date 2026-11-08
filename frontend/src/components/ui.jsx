import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Inbox, Rss } from "lucide-react";

// ===================== Loading =====================

const LOADING_MESSAGES = [
  "Consulting Mission Control…",
  "Computing your escape velocity…",
  "Aligning the solar panels…",
  "Filing paperwork with the Space Ministry…",
  "Checking for space traffic…",
  "Asking the Moon for permission…",
  "Calibrating zero-gravity sensors…",
];

export function Loading({ className = "h-6 w-6" }) {
  const [msg, setMsg] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setMsg((m) => (m + 1) % LOADING_MESSAGES.length), 1600);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <Loader2 className={`mx-auto animate-spin ${className} text-brand-sky`} />
        <p className="mt-3 font-mono text-sm text-[#B3BECE]">{LOADING_MESSAGES[msg]}</p>
      </div>
    </div>
  );
}

export function Spinner({ className = "h-6 w-6" }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

// ===================== ErrorState =====================

export function ErrorState({ message = "Something went wrong. Even rockets have engine weeks." }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-brand-coral/30 bg-brand-coral/10 p-6 text-center">
        <AlertCircle className="mx-auto h-9 w-9 text-brand-coral" />
        <p className="mt-3 font-semibold text-white">{message}</p>
        <p className="mt-1 text-sm text-[#8492A6]">Mission control has been notified. They're pretending not to panic.</p>
      </div>
    </div>
  );
}

// ===================== EmptyState =====================

const EMPTY_COPY = {
  bookings: { title: "No missions yet", sub: "Even astronauts have to start somewhere. Go book your first escape." },
  attempts: { title: "No assessments attempted", sub: "Your astronaut career is currently experiencing a lack of effort." },
  saved: { title: "Nothing saved yet", sub: "The universe is enormous, just saying.", icon: Rss },
};

export function EmptyState({ title = "Nothing here yet", description, variant, icon: Icon }) {
  const copy = EMPTY_COPY[variant];
  const t = copy?.title || title;
  const d = copy?.sub || description;
  const I = Icon || copy?.icon || Inbox;
  return (
    <div className="flex items-center justify-center py-16">
      <div className="mx-auto max-w-sm rounded-2xl border-2 border-dashed border-navy-400 bg-navy-800/60 p-8 text-center">
        <I className="mx-auto h-10 w-10 text-brand-sky" />
        <p className="mt-3 font-display text-lg font-semibold text-white">{t}</p>
        {d && <p className="mt-1 text-sm text-[#8492A6]">{d}</p>}
      </div>
    </div>
  );
}

// ===================== SectionHeading =====================

export function SectionHeading({ eyebrow, title, sub, center, light }) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      {eyebrow && <p className="text-brand-saffron eyebrow">{eyebrow}</p>}
      <h2 className={light ? "section-title-light" : "section-title"}>{title}</h2>
      {sub && <p className={light ? "section-sub-light" : "section-sub"}>{sub}</p>}
    </div>
  );
}

// ===================== LaunchButton =====================

export function LaunchButton({ children, onClick, className = "btn-saffron", ...props }) {
  const [boosting, setBoosting] = useState(false);
  const handleClick = (e) => {
    if (className.includes("btn-saffron") || className.includes("btn-sky")) {
      setBoosting(true);
      setTimeout(() => setBoosting(false), 800);
    }
    onClick?.(e);
  };
  return (
    <button {...props} onClick={handleClick} className={`${className} relative overflow-hidden`}>
      <span className={`inline-flex items-center gap-2 transition-transform ${boosting ? "-translate-y-1" : ""}`}>
        {children}
        {boosting && <Rss className="h-4 w-4 animate-pulse" />}
      </span>
    </button>
  );
}
