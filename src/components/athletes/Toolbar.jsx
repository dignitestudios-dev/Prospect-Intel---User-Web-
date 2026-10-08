import { ArrowDownAZ, ArrowUpAZ, LayoutGrid, Rows3, Search, X } from "lucide-react";
import { cn } from "../../ui/cn";

/** Sort keys are the exact values the API already understands. */
export const SORT_OPTIONS = [
  { value: "", label: "Default order" },
  { value: "Player", label: "Name" },
  { value: "Grad", label: "Class year" },
  { value: "Position", label: "Position" },
  { value: "Football Character", label: "Football character" },
  { value: "Personal Character", label: "Personal character" },
  { value: "Height", label: "Height" },
  { value: "Width", label: "Weight" },
  { value: "High School", label: "High school" },
  { value: "State", label: "State" },
  { value: "Committed College", label: "Committed college" },
];

export function SearchInput({ value, onChange, placeholder, className, inputRef }) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        inputMode="search"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-full rounded-lg border border-white/80 bg-white/65 pl-9 pr-9 shadow-card backdrop-blur-md text-sm text-ink placeholder:text-ink-400 hover:border-ink-300 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-1.5 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-ink-400 hover:bg-ink-100 hover:text-ink"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export function SortMenu({ sortBy, sortOrder, onChange, onToggleOrder }) {
  return (
    <div className="flex items-center gap-1.5">
      <label className="sr-only" htmlFor="sort-by">
        Sort by
      </label>
      <select
        id="sort-by"
        value={sortBy}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 rounded-lg border border-white/80 bg-white/65 pl-2.5 pr-7 text-[13px] text-ink-700 backdrop-blur-md hover:border-ink-300 focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.value ? `Sort: ${o.label}` : "Sort: Default"}
          </option>
        ))}
      </select>
      {sortBy && (
        <button
          type="button"
          onClick={onToggleOrder}
          aria-label={sortOrder === "asc" ? "Ascending. Switch to descending" : "Descending. Switch to ascending"}
          title={sortOrder === "asc" ? "Ascending" : "Descending"}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/80 bg-white/65 text-ink-600 backdrop-blur-md hover:bg-white"
        >
          {sortOrder === "asc" ? <ArrowUpAZ className="h-4 w-4" /> : <ArrowDownAZ className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}

export function ViewToggle({ view, onChange }) {
  const btn = (key, Icon, label) => (
    <button
      type="button"
      onClick={() => onChange(key)}
      aria-pressed={view === key}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded transition-colors",
        view === key ? "bg-white text-ink shadow-card" : "text-ink-400 hover:text-ink",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
  return (
    <div className="hidden items-center gap-0.5 rounded-lg border border-white/80 bg-white/50 p-0.5 backdrop-blur-md md:flex" role="group" aria-label="Layout">
      {btn("table", Rows3, "Table view")}
      {btn("cards", LayoutGrid, "Card view")}
    </div>
  );
}

/** Floating bar that appears while athletes are selected. */
export function SelectionBar({ count, onClear, children }) {
  if (!count) return null;
  return (
    <div className="no-print pointer-events-none fixed inset-x-0 bottom-[72px] z-30 flex justify-center px-3 md:bottom-6">
      <div
        role="region"
        aria-label="Selected athletes"
        className="glass-dark pointer-events-auto flex max-w-full animate-rise-in flex-wrap items-center gap-2 rounded-xl p-1.5 pl-3.5 text-white"
      >
        <span className="mr-1 text-[13px] font-medium tabular-nums">{count} selected</span>
        {children}
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear selection"
          className="flex h-8 w-8 items-center justify-center rounded-md text-ink-300 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
