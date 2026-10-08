import { Outlet } from "react-router";
import { Check } from "lucide-react";
import { Logo } from "../assets/export";
import heroImg from "../assets/login-hero.webp";

const POINTS = [
  "Character grades from A to F on every prospect",
  "Family background, strengths and weaknesses in one profile",
  "Assessments written by former college personnel directors",
];

/** Form on the left, a full-height image panel on the right (large screens). */
const AuthLayout = () => {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Form */}
      <main className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[400px]">
          <div className="mb-8 flex items-center gap-2.5">
            <img src={Logo} alt="" className="h-9 w-9" />
            <span className="text-base font-semibold tracking-tight text-ink">Prospect Intel</span>
          </div>
          <div className="card p-7 sm:p-8">
            <Outlet />
          </div>
          <p className="mt-6 text-center text-xs text-ink-500">&copy; {new Date().getFullYear()} Prospect Intel</p>
        </div>
      </main>

      {/* Image panel */}
      <aside className="relative hidden p-3 lg:block" aria-hidden="true">
        <div className="relative h-full overflow-hidden rounded-3xl bg-[#06111F] shadow-lift">
          {/* depth: gradient wash, rim-light glow behind the players, soft orbs */}
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#06111F_0%,#0A2745_52%,#0B4E86_100%)]" />
          <div className="absolute left-1/2 top-[22%] h-[62%] w-[92%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(125,211,252,0.65),rgba(14,165,233,0.28)_55%,transparent_75%)] blur-2xl" />
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-signal/40 blur-3xl" />
          <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />

          <img
            src={heroImg}
            alt=""
            className="absolute bottom-[17%] left-1/2 h-[66%] max-w-none -translate-x-1/2 select-none object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
            draggable="false"
          />
          {/* fade the base of the image into the panel */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#06111F] via-[#06111F]/70 to-transparent" />

          {/* floating glass: value statement */}
          <div className="glass-dark absolute inset-x-8 bottom-8 rounded-2xl p-6 text-white">
            <h1 className="max-w-md text-[26px] font-semibold leading-tight tracking-tight">
              Recruiting intelligence for college football staffs.
            </h1>
            <ul className="mt-5 space-y-2.5">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-200">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AuthLayout;
