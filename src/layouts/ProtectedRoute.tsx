import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const ProtectedRoute = () => {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }

    // Role-based access restriction
    if ((role === "waiter" && location.pathname.startsWith("/chef"))  ) {
        return <Navigate to="/waiter"/>;
    }

    if (role === "chef" && location.pathname.startsWith("/waiter")) {
        return <Navigate to="/chef" />;
    }

    return <Outlet />;

};

export default ProtectedRoute;
