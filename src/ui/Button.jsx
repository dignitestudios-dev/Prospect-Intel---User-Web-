import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./cn";

const VARIANTS = {
  primary:
    "bg-signal text-white shadow-sm hover:bg-signal-700 active:bg-signal-700 disabled:bg-signal/45",
  dark: "bg-ink text-white hover:bg-ink-800 active:bg-ink-800 disabled:bg-ink/45",
  secondary:
    "border border-white/80 bg-white/65 text-ink-700 shadow-card backdrop-blur-md hover:bg-white disabled:text-ink-300",
  ghost: "text-ink-600 hover:bg-ink-100 active:bg-ink-100 disabled:text-ink-300",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/45",
  onDark: "border border-white/15 bg-white/10 text-white hover:bg-white/15",
};

const SIZES = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-[13px]",
  md: "h-9 gap-2 rounded-lg px-3.5 text-sm",
  lg: "h-10 gap-2 rounded-lg px-4 text-sm",
  icon: "h-9 w-9 rounded-lg",
  "icon-sm": "h-8 w-8 rounded-lg",
};

const Button = forwardRef(function Button(
  { variant = "secondary", size = "md", loading = false, disabled, className, children, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-medium transition-colors disabled:cursor-not-allowed",
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});

export default Button;
