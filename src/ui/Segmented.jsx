import { cn } from "./cn";

/** Two-to-four option switch, e.g. Active / Archived. */
export default function Segmented({ value, onChange, options, label, className }) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn("inline-flex items-center rounded-lg border border-white/80 bg-white/50 p-0.5 backdrop-blur-md", className)}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={cn(
              "h-7 rounded-md px-3 text-[13px] font-medium transition-colors",
              active ? "bg-white text-ink shadow-card" : "text-ink-500 hover:text-ink",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
