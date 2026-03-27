
import { Navigate, useLocation } from "react-router";
import Cookies from "js-cookie";

const RequireAuth = ({ children }) => {
    const location = useLocation();

    const token = Cookies.get("userToken");
    const isAuthenticated = Boolean(token);

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default RequireAuth;