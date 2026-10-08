import { cn } from "./cn";

/** Empty and error states: say what happened, then offer the next step. */
export default function EmptyState({ icon: Icon, title, children, action, className }) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-14 text-center", className)}>
      {Icon && (
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-ink-50 text-ink-400">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      {children && <p className="mt-1 max-w-sm text-[13px] leading-relaxed text-ink-500">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
