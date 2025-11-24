import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
export const RoleGuard = ({ roles }) => {
    console.log(roles);
    // TODO
    //const { user } = useAuth();
    /* if (!user) {
      return <Navigate to="/auth/login" replace />;
    } */
    /* if (!roles.includes(user.role)) {
      return <Navigate to="/" replace />;
    } */
    return _jsx(Outlet, {});
};
