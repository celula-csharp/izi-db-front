import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { useAuth } from "@/auth/useAuth";
export const RoleGuard = ({ roles }) => {
    const { user } = useAuth();
    console.log(user);
    console.log(roles);
    /* if (!user) {
      return <Navigate to="/auth/login" replace />;
    } */
    /* if (!roles.includes(user.role)) {
      return <Navigate to="/" replace />;
    } */
    return _jsx(Outlet, {});
};
