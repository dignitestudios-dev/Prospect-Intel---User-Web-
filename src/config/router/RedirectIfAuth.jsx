import { Navigate } from "react-router";
import Cookies from "js-cookie";

const RedirectIfAuth = ({ children }) => {
    const token = Cookies.get("userToken");
    const isAuthenticated = Boolean(token);

    if (isAuthenticated) {
        return <Navigate to="/app/dashboard" replace />;
    }

    return <>{children}</>;
};

export default RedirectIfAuth;
