import { toast, Toaster } from "react-hot-toast";
import { NavLink } from "react-router";

const baseStyle = {
  background: "#0F172A",
  color: "#fff",
  borderRadius: "8px",
  padding: "10px 14px",
  fontSize: "13px",
  fontWeight: 500,
  boxShadow: "0 12px 32px -8px rgba(15,23,42,0.35)",
  maxWidth: "420px",
};

export const ToasterContainer = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      containerStyle={{ top: 16 }}
      toastOptions={{ style: baseStyle }}
    />
  );
};

// Global toast ID (ensures only one toast is shown at a time)
let toastId = null;

export const SuccessToast = (message) => {
  if (toastId) toast.dismiss(toastId); // Dismiss previous toast
  toastId = toast.success(message, {
    duration: 3000,
    style: baseStyle,
    iconTheme: { primary: "#3DAA6D", secondary: "#0F172A" },
  });
};

export const ErrorToast = (message) => {
  if (toastId) toast.dismiss(toastId); // Dismiss previous toast
  toastId = toast.error(message, {
    duration: 4000,
    style: baseStyle,
    iconTheme: { primary: "#F2615C", secondary: "#0F172A" },
  });
};

export const WarningToast = (message) => {
  if (toastId) toast.dismiss(toastId); // Dismiss previous toast
  toastId = toast(message, {
    icon: "⚠️",
    duration: 3500,
    style: baseStyle,
  });
};

export const NotificationToast = ({ title, message, route }) => {
  if (toastId) toast.dismiss(toastId); // Dismiss previous toast
  toastId = toast.custom(
    (t) => (
      <NavLink
        to={route}
        className={`${
          t.visible ? "animate-rise-in" : "opacity-0"
        } flex w-full max-w-md gap-3 rounded-lg bg-white p-4 shadow-pop ring-1 ring-line`}
      >
        <img className="h-10 w-10 rounded-lg" src="/logo.png" alt="" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="mt-0.5 text-sm text-ink-500">{message}</p>
        </div>
      </NavLink>
    ),
    { position: "bottom-right" },
  );
};
