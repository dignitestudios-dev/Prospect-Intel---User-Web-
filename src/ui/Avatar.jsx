import { useState } from "react";
import { cn } from "./cn";

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
  xl: "h-[72px] w-[72px] text-xl",
};

const initialsOf = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

/** Photo with an initials fallback (no broken-image icons, no generic silhouette). */
export default function Avatar({ src, name, size = "md", rounded = "full", className }) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed && !String(src).endsWith("default.svg");

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-ink-100 font-semibold uppercase text-ink-500",
        rounded === "full" ? "rounded-full" : "rounded-lg",
        SIZES[size],
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={name ? `${name}` : ""}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initialsOf(name) || "·"}</span>
      )}
    </span>
  );
}
