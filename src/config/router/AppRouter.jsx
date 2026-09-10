import { AuthRoutes } from "../routes/AuthRoutes";
import { lazy, Suspense } from "react";
import RequireAuth from "./RequireAuth";
import RedirectIfAuth from "./RedirectIfAuth";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { ProtectedRoutes } from "../routes/ProtectedRoutes";
import Loader from "../../components/global/Loader";
import Cookies from "js-cookie";

const AuthLayout = lazy(() => import("../../layouts/AuthLayout"));
const DashboardLayout = lazy(() => import("../../layouts/DashboardLayout"));

const RootRedirect = () => {
    const token = Cookies.get("userToken");
    return <Navigate to={token ? "/app/dashboard" : "/auth/login"} replace />;
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootRedirect />,
    },
    {
        path: "/auth",
        element: (
            <RedirectIfAuth>
                <AuthLayout />
            </RedirectIfAuth>
        ),
        children: AuthRoutes,
    },
    {
        path: "/app",
        element: (
            <RequireAuth>
                <DashboardLayout />
            </RequireAuth>
        ),
        children: ProtectedRoutes,
    },
    {
        path: "*",
        element: <>Not Found</>,
    },
]);

export default function AppRouter() {
    return (
        <Suspense fallback={<Loader />}>
            <RouterProvider router={router} />
        </Suspense>
    );
}