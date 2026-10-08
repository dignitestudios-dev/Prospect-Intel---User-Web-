import { useEffect, useState } from "react";
import { Logo } from "../../assets/export";
import GradeStamp from "../../ui/GradeStamp";
import { cn } from "../../ui/cn";

// True once the first full-screen splash has finished, so later route loads
// use the small loader instead of replaying the whole animation.
let booted = false;
export const hasBooted = () => booted;
export const markBooted = () => {
  booted = true;
};

const GRADES = ["A", "B", "C", "D", "F"];
const rise = (delay) => ({ animationDelay: `${delay}ms` });

/**
 * Brand loading screen: the logo reveals inside an orbiting ring, the
 * A to F grades light up in turn, and a progress bar sweeps underneath.
 */
export default function Splash({ leaving = false }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "splash-bg fixed inset-0 z-[300] flex items-center justify-center transition-opacity duration-500",
        leaving ? "pointer-events-none opacity-0" : "opacity-100",
      )}
    >
      <span className="sr-only">Loading Prospect Intel</span>

      <div className="flex flex-col items-center px-6">
        {/* logo + orbit */}
        <div className="relative h-32 w-32 animate-splash-logo">
          <div className="absolute inset-3 animate-splash-glow rounded-full bg-signal/35 blur-2xl" />
          <svg className="absolute inset-0 animate-splash-spin" viewBox="0 0 128 128" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="splash-arc" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0A7CC2" stopOpacity="0" />
                <stop offset="55%" stopColor="#0A7CC2" />
                <stop offset="100%" stopColor="#7DD3FC" />
              </linearGradient>
            </defs>
            <circle cx="64" cy="64" r="58" stroke="rgba(15,23,42,0.08)" strokeWidth="2" />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="url(#splash-arc)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="230 135"
            />
          </svg>
          <div className="absolute inset-[18px] flex items-center justify-center rounded-full bg-white/75 shadow-lift ring-1 ring-white backdrop-blur-md">
            <img src={Logo} alt="" className="h-14 w-14" />
          </div>
        </div>

        {/* name */}
        <p className="mt-7 animate-splash-rise text-xl font-semibold tracking-tight text-ink" style={rise(250)}>
          Prospect Intel
        </p>
        <p className="mt-1 animate-splash-rise text-[13px] text-ink-500" style={rise(400)}>
          Preparing your recruiting board
        </p>

        {/* grades light up one after another */}
        <div className="mt-6 flex gap-1.5" aria-hidden="true">
          {GRADES.map((g, i) => (
            <span key={g} className="animate-splash-chip" style={{ animationDelay: `${600 + i * 160}ms` }}>
              <GradeStamp grade={g} size="sm" className="min-w-8" />
            </span>
          ))}
        </div>

        {/* sweeping progress */}
        <div className="mt-6 h-1 w-44 overflow-hidden rounded-full bg-ink-900/10" aria-hidden="true">
          <div className="h-full w-1/3 animate-splash-bar rounded-full bg-gradient-to-r from-signal/0 via-signal to-signal/0" />
        </div>
      </div>
    </div>
  );
}

/** Mounts the splash while `active`, then fades it out and removes it. */
export function SplashOverlay({ active, onGone }) {
  const [render, setRender] = useState(active);

  useEffect(() => {
    if (active) {
      setRender(true);
      return undefined;
    }
    const t = setTimeout(() => {
      setRender(false);
      onGone?.();
    }, 520);
    return () => clearTimeout(t);
  }, [active, onGone]);

  if (!render) return null;
  return <Splash leaving={!active} />;
}
