import { NavLink } from "react-router";
import { NAV_ITEMS } from "./TopBar";
import { cn } from "../../ui/cn";

/** Thumb-reach navigation for phones; the top bar's tabs take over from md up. */
export default function MobileNav() {
  return (
    <nav
      aria-label="Primary"
      className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-white/70 bg-white/70 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 md:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
                  isActive ? "text-signal" : "text-ink-400",
                )
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
