import { Logo } from "../../assets/export";
import Splash, { hasBooted } from "./Splash";

/** Suspense fallback: the full brand splash on first load, a small loader after that. */
const Loader = () => {
  if (!hasBooted()) return <Splash />;
  return (
    <div role="status" aria-live="polite" className="fixed inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <img src={Logo} alt="" className="h-10 w-10 animate-pulse" />
        <p className="text-xs font-medium text-ink-400">Loading</p>
      </div>
    </div>
  );
};

export default Loader;
