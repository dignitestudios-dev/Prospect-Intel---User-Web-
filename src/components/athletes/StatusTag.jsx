import { cn } from "../../ui/cn";

// Tags that flag a risk read amber; everything else reads as a positive or neutral note.
const CONCERNS = ["medical concern", "academic concern", "transfer risk", "off field concern"];

export const isConcern = (tag = "") => CONCERNS.includes(String(tag).trim().toLowerCase());

export default function StatusTag({ tag, size = "sm", onDark = false }) {
  const concern = isConcern(tag);
  const tone = onDark
    ? concern
      ? "border-amber-400/40 bg-amber-400/10 text-amber-200"
      : "border-white/20 bg-white/10 text-white"
    : concern
      ? "border-amber-300/70 bg-amber-50 text-amber-800"
      : "border-white/80 bg-white/60 text-ink-600";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-medium",
        size === "sm" ? "px-1.5 py-px text-[11px]" : "px-2 py-0.5 text-xs",
        tone,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", concern ? "bg-amber-500" : onDark ? "bg-ink-300" : "bg-ink-400")}
      />
      {tag}
    </span>
  );
}

/** Shows the first `max` tags and a "+n" overflow chip. */
export function StatusTags({ tags, max = 2, size = "sm", onDark = false }) {
  const list = Array.isArray(tags) ? tags.filter(Boolean) : [];
  if (list.length === 0) return null;
  const shown = max ? list.slice(0, max) : list;
  const rest = list.length - shown.length;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {shown.map((t) => (
        <StatusTag key={t} tag={String(t).trim()} size={size} onDark={onDark} />
      ))}
      {rest > 0 && (
        <span
          title={list.slice(max).join(", ")}
          className="rounded-full bg-ink-100 px-1.5 py-px text-[11px] font-medium text-ink-500"
        >
          +{rest}
        </span>
      )}
    </div>
  );
}
