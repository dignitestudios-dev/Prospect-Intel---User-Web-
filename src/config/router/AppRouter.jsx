import { AuthRoutes } from "../routes/AuthRoutes";
import { lazy, Suspense } from "react";
import RequireAuth from "./RequireAuth";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { ProtectedRoutes } from "../routes/ProtectedRoutes";
import Loader from "../../components/global/Loader";


const AuthLayout = lazy(() => import("../../layouts/AuthLayout"));
const DashboardLayout = lazy(() => import("../../layouts/DashboardLayout"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/auth/login" replace />,
    },
    {
        path: "/auth",
        element: <AuthLayout />,
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