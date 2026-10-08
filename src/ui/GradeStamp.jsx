import { cn } from "./cn";
import { parseGrade } from "./grades";

const SIZES = {
  xs: "h-5 min-w-5 px-1 text-[11px] rounded",
  sm: "h-6 min-w-7 px-1.5 text-xs rounded",
  md: "h-7 min-w-8 px-2 text-[13px] rounded-md",
  lg: "h-9 min-w-10 px-2.5 text-base rounded-md",
  xl: "h-12 min-w-14 px-3 text-2xl rounded-lg",
};

/**
 * A grade badge: soft tint, coloured letter, hairline ring.
 * <GradeStamp grade="A-" size="md" />
 */
export default function GradeStamp({ grade, size = "md", className, title }) {
  const g = parseGrade(grade);
  const label = g.base
    ? `${g.name}, grade ${g.base}${g.modifier === "+" ? " plus" : g.modifier === "-" ? " minus" : ""}`
    : "Not graded";

  return (
    <span
      role="img"
      aria-label={label}
      title={title ?? label}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center font-semibold leading-none tabular-nums ring-1 ring-inset",
        SIZES[size],
        g.tone,
        className,
      )}
    >
      {g.base || "–"}
      {g.modifier && <span className="font-semibold">{g.modifier === "-" ? "−" : g.modifier}</span>}
    </span>
  );
}
