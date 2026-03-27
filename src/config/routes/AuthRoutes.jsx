import { lazy } from "react";

const Login = lazy(() => import("../../pages/authentication/Login"));
const ForgotPassword = lazy(() => import('../../pages/authentication/ForgotPassword'))
const ResetPassword = lazy(() => import('../../pages/authentication/ResetPassword'))
const Verification = lazy(() => import('../../pages/authentication/Verification'))


export const AuthRoutes = [
    { path: 'login', element: <Login /> },
    { path: 'forgot-password', element: <ForgotPassword /> },
    { path: 'reset-password', element: <ResetPassword /> },
    { path: 'verification', element: <Verification /> },
];


