import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "./cn";

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal.
 *  variant="center"  -> centred card (bottom sheet on phones)
 *  variant="drawer"  -> right-hand panel (full width on phones)
 * Esc and a click on the backdrop close it; focus is trapped and restored.
 */
export default function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  variant = "center",
  size = "md",
  dismissible = true,
}) {
  const panelRef = useRef(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const first = panel?.querySelector("[data-autofocus]") || panel?.querySelector(FOCUSABLE);
    (first || panel)?.focus();

    const onKey = (e) => {
      if (e.key === "Escape" && dismissible) {
        e.stopPropagation();
        onClose?.();
      }
      if (e.key === "Tab" && panel) {
        const nodes = [...panel.querySelectorAll(FOCUSABLE)];
        if (nodes.length === 0) return;
        const firstNode = nodes[0];
        const lastNode = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === firstNode) {
          e.preventDefault();
          lastNode.focus();
        } else if (!e.shiftKey && document.activeElement === lastNode) {
          e.preventDefault();
          firstNode.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose, dismissible]);

  if (!open) return null;

  const widths = { sm: "sm:max-w-sm", md: "sm:max-w-lg", lg: "sm:max-w-2xl" };

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[100] flex bg-ink-900/40 backdrop-blur-[3px] animate-fade-in",
        variant === "drawer" ? "justify-end" : "items-end justify-center sm:items-center sm:p-6",
      )}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && dismissible) onClose?.();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "glass-strong flex max-h-full w-full flex-col outline-none",
          variant === "drawer"
            ? "h-full max-w-md animate-slide-in-right"
            : cn(
                "max-h-[92dvh] animate-slide-up rounded-t-xl sm:animate-rise-in sm:rounded-xl",
                widths[size],
              ),
        )}
      >
        {(title || dismissible) && (
          <header className="flex items-start justify-between gap-4 border-b border-ink-900/10 px-5 py-3.5">
            <div className="min-w-0">
              {title && (
                <h2 id={titleId} className="text-base font-semibold leading-tight text-ink">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descId} className="mt-1 text-[13px] text-ink-500">
                  {description}
                </p>
              )}
            </div>
            {dismissible && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-1.5 -mt-1 rounded-md p-1.5 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </header>
        )}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-ink-900/10 bg-white/40 px-5 py-3 sm:rounded-b-xl">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
