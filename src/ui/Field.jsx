import { forwardRef, useId } from "react";
import { cn } from "./cn";

const base =
  "w-full rounded-lg border bg-white/70 text-sm text-ink placeholder:text-ink-400 transition-colors focus:border-signal focus:outline-none focus:ring-2 focus:ring-signal/20 disabled:bg-ink-50 disabled:text-ink-400";

/** Labelled text input with inline error and optional trailing control. */
export const TextField = forwardRef(function TextField(
  { label, error, hint, trailing, leading, className, inputClassName, id, size = "md", ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id || auto;
  const describedBy = error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-[13px] font-medium text-ink-700">
          {label}
        </label>
      )}
      <div className="relative">
        {leading && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-ink-400">
            {leading}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            base,
            size === "lg" ? "h-10" : "h-9",
            leading ? "pl-9" : "px-3",
            trailing && "pr-10",
            error ? "border-red-500" : "border-white/90 shadow-card hover:border-ink-200",
            inputClassName,
          )}
          {...rest}
        />
        {trailing && <span className="absolute inset-y-0 right-1 flex items-center">{trailing}</span>}
      </div>
      {error ? (
        <p id={`${inputId}-err`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export const TextArea = forwardRef(function TextArea(
  { label, error, hint, className, maxLength, value, id, ...rest },
  ref,
) {
  const auto = useId();
  const inputId = id || auto;
  const length = typeof value === "string" ? value.length : 0;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-[13px] font-medium text-ink-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        value={value}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        className={cn(
          base,
          "min-h-[112px] resize-y px-3 py-2.5 leading-relaxed",
          error ? "border-red-500" : "border-ink-200 hover:border-ink-300",
        )}
        {...rest}
      />
      <div className="mt-1.5 flex items-start justify-between gap-3 text-xs">
        <span className={error ? "text-red-600" : "text-ink-500"} role={error ? "alert" : undefined}>
          {error || hint || ""}
        </span>
        {maxLength ? (
          <span className="shrink-0 tabular-nums text-ink-400">
            {length}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
});

/** Custom checkbox that keeps a compact look. */
export const Checkbox = forwardRef(function Checkbox(
  { checked, indeterminate, onChange, label, className, ...rest },
  ref,
) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2", className)}>
      <input
        ref={(node) => {
          if (node) node.indeterminate = Boolean(indeterminate) && !checked;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
        {...rest}
      />
      <span
        aria-hidden="true"
        className="flex h-4 w-4 items-center justify-center rounded-[4px] border border-ink-300 bg-white transition-colors peer-checked:border-signal peer-checked:bg-signal peer-focus-visible:ring-2 peer-focus-visible:ring-signal/70 peer-focus-visible:ring-offset-1 peer-indeterminate:border-signal peer-indeterminate:bg-signal"
      >
        {checked ? (
          <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 6.2l2.4 2.4 4.6-5" />
          </svg>
        ) : indeterminate ? (
          <span className="h-0.5 w-2 rounded bg-white" />
        ) : null}
      </span>
      {label && <span className="text-sm text-ink-700">{label}</span>}
    </label>
  );
});
