import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children, allowedRoles }) {
    const { token, user, isLoading } = useAuth();

    if(isLoading) {
        return <p>Loading...</p>
    }

    if(!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} replace />;
    }

    return children;

};

export default ProtectedRoute;