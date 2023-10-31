import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// const RequireAuth = ({ allowedRoles }) => {
const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        //if user is not logged inm navigate to login page

        auth?.user  
            ? <Outlet />
            : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;