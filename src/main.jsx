import { StrictMode, Suspense, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { ReduxProvider } from "./lib/store/provider.jsx";
import "./index.css";
import "./App.css";
import Loader from "./components/global/Loader.jsx";
import { SplashOverlay, markBooted } from "./components/global/Splash.jsx";
import AppRouter from "./config/router/AppRouter.jsx";
import { ToasterContainer } from "./components/global/Toaster.jsx";
import ReactQueryProvider from "./lib/query/ReactQueryProvider.jsx";

/** Shows the brand splash on every page load while the app starts up underneath. */
function AppBoot({ children }) {
  const [active, setActive] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setActive(false), 1700);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {children}
      <SplashOverlay active={active} onGone={markBooted} />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<Loader />}>
      <ReduxProvider>
        <ReactQueryProvider>
          <ToasterContainer />
          <AppBoot>
            <AppRouter />
          </AppBoot>
        </ReactQueryProvider>
      </ReduxProvider>
    </Suspense>
  </StrictMode>,
);
