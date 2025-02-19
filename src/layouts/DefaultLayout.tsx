import { useAuth } from "@/hooks";
import { Navigate, useLocation } from "react-router-dom";

const DefaultLayout = () => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={"/auth/login"} state={{ from: location }} replace />;
  }

  if (role === "waiter" ) {
    return <Navigate to="/waiter/dashboard" />;
  }

  if (role === "cashier" ) {
    return <Navigate to="/cashier/dashboard" />;
  }

  if (role === "chef" ) {
    return <Navigate to="/chef/dashboard" />;
  }

  return (
    <div className="h-screen flex overflow-hidden">
    </div>
  );
};

export default DefaultLayout;
