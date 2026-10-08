import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import TopBar from "../components/layout/TopBar";
import MobileNav from "../components/layout/MobileNav";
import NoInternetModal from "../components/global/NoInternet";
import { SplashOverlay, markBooted } from "../components/global/Splash";

const DashboardLayout = () => {
  const { pathname } = useLocation();
  const [offline, setOffline] = useState(false);

  // Right after signing in, play the loading animation once while the dashboard loads.
  const [splash, setSplash] = useState(() => {
    try {
      return sessionStorage.getItem("pi_splash") === "1";
    } catch {
      return false;
    }
  });
  useEffect(() => {
    if (!splash) return undefined;
    try {
      sessionStorage.removeItem("pi_splash");
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => setSplash(false), 1700);
    return () => clearTimeout(t);
  }, [splash]);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("offline", update);
    window.addEventListener("online", update);
    return () => {
      window.removeEventListener("offline", update);
      window.removeEventListener("online", update);
    };
  }, []);

  // New screen = start at the top.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only z-[200] rounded-lg bg-white px-4 py-2 text-sm font-medium text-ink shadow-lift focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <TopBar />
      <main id="main" className="pb-24 md:pb-10">
        <Outlet />
      </main>
      <MobileNav />
      <NoInternetModal isOpen={offline} />
      <SplashOverlay active={splash} onGone={markBooted} />
    </div>
  );
};

export default DashboardLayout;
