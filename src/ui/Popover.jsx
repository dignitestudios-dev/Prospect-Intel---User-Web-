import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "./cn";

/**
 * Click-to-open floating panel.
 *   <Popover trigger={({ open, toggle, triggerProps }) => <button {...triggerProps}>…</button>}>
 *     {({ close }) => <div>…</div>}
 *   </Popover>
 * The panel is rendered at the top of the page (a portal) so its frosted-glass
 * blur sees the real page behind it, even when the trigger sits inside a blurred bar.
 * Closes on outside click, Esc, and when the page is resized.
 * `inset` makes the panel span the screen width on phones.
 */
export default function Popover({
  trigger,
  children,
  align = "start",
  panelClassName,
  className,
  label,
  glass = "strong",
  inset = false,
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const panelId = useId();

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((o) => !o), []);

  const place = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const small = inset && window.innerWidth < 640;
    if (small) {
      setPos({ top: r.bottom + 8, left: 12, right: 12 });
    } else if (align === "end") {
      setPos({ top: r.bottom + 8, right: Math.max(12, window.innerWidth - r.right) });
    } else {
      setPos({ top: r.bottom + 8, left: Math.max(12, r.left) });
    }
  }, [align, inset]);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      const inRoot = rootRef.current && rootRef.current.contains(e.target);
      const inPanel = panelRef.current && panelRef.current.contains(e.target);
      if (!inRoot && !inPanel) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => place();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open, place]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {trigger({
        open,
        toggle,
        close,
        triggerProps: {
          onClick: toggle,
          "aria-haspopup": "dialog",
          "aria-expanded": open,
          "aria-controls": open ? panelId : undefined,
        },
      })}
      {open &&
        pos &&
        createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="dialog"
            aria-label={label}
            style={{ position: "fixed", top: pos.top, left: pos.left, right: pos.right }}
            className={cn(
              "z-[90] min-w-[240px] max-w-[calc(100vw-1.5rem)] animate-rise-in rounded-xl",
              glass === "menu" ? "glass-menu" : "glass-strong",
              panelClassName,
            )}
          >
            {typeof children === "function" ? children({ close }) : children}
          </div>,
          document.body,
        )}
    </div>
  );
}
