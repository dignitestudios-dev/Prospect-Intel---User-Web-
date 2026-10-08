import { useState } from "react";
import { GraduationCap } from "lucide-react";
import { cn } from "./cn";

/** A college's logo, or a quiet graduation-cap mark when it has none. */
export default function CollegeLogo({ src, className, onDark = false }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <GraduationCap
        aria-hidden="true"
        className={cn("shrink-0", "text-ink-300", className || "h-5 w-5")}
      />
    );
  }
  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      className={cn("shrink-0 object-contain", onDark && "rounded bg-white/90 p-0.5", className || "h-6 w-6")}
    />
  );
}
