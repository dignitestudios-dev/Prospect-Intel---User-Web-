import { Navigate, Route, Routes } from "react-router";
import "./App.css";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

// App Pages
import DummyHome from "./pages/app/DummyHome";
import Users from "./pages/app/Users";
import Notifications from "./pages/app/Notifications";
import UserDetails from "./pages/app/UserDetails";

// Auth Pages
import DummyLogin from "./pages/authentication/DummyLogin";
import ForgotPassword from "./pages/authentication/ForgotPassword";
import ResetPassword from "./pages/authentication/ResetPassword";
import Verification from "./pages/authentication/Verification";

// Route Guard
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Posts from "./pages/app/Posts";
import Reports from "./pages/app/Reports";
import Profile from "./pages/app/Profile";
import { Settings } from "lucide-react";
import SettingsPage from "./pages/app/Settings";
import Saved from "./pages/app/Saved";

function App() {
  return (
    <Routes>
      {/* 🔐 Protected App Routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="app" element={<DashboardLayout />}>
          {/* <Route path="dashboard" element={<DummyHome />} /> */}
          
        </Route>
      </Route>

      {/* 🔓 Public Auth Routes */}
      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<DummyLogin />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password" element={<ResetPassword />} />
        <Route path="verification" element={<Verification />} />
      </Route>

      {/* test */}
      <Route path="app" element={<DashboardLayout />}>
        <Route path="dashboard" element={<DummyHome />} />
        <Route path="users" element={<Users />} />
                <Route path="profile" element={<Profile />} />

        <Route path="notifications" element={<Notifications />} />
        <Route path="user-details" element={<UserDetails />} />
        <Route path="posts" element={<Posts />} />
        <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="saved" element={<Saved />} />




      </Route>

        {/* <Route path="settings" element={<SettingsPage />} /> */}

      <Route path="/" element={<Navigate to="/auth/login" />} />

      {/* 404 Fallback */}
      <Route
        path="*"
        element={<div className="text-7xl text-center mt-10">Page Not Found</div>}
      />
    </Routes>
  );
}

export default App;
