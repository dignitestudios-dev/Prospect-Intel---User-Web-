import { lazy } from "react";


const DummyHome = lazy(() => import("../../pages/app/DummyHome"));
const Users = lazy(() => import("../../pages/app/Users"));
const Profile = lazy(() => import("../../pages/app/Profile"));
const Notifications = lazy(() => import("../../pages/app/Notifications"));
const UserDetails = lazy(() => import("../../pages/app/UserDetails"));
const Posts = lazy(() => import("../../pages/app/Posts"));
const Reports = lazy(() => import("../../pages/app/Reports"));
const SettingsPage = lazy(() => import("../../pages/app/Settings"));
const Saved = lazy(() => import("../../pages/app/Saved"));

export const ProtectedRoutes = [

    { path: "dashboard", element: <DummyHome /> },
    { path: "users", element: <Users /> },
    { path: "profile/:id", element: <Profile /> },
    { path: "notifications", element: <Notifications /> },
    { path: "user-details", element: <UserDetails /> },
    { path: "posts", element: <Posts /> },
    { path: "reports", element: <Reports /> },
    { path: "settings", element: <SettingsPage /> },
    { path: "saved", element: <Saved /> },

];

