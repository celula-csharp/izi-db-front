import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';
export const ProtectedRoute = () => {
    const { isLoading } = useAuth();
    // const location = useLocation();
    if (isLoading) {
        return _jsx("div", { style: { padding: 24 }, children: "Cargando sesi\u00F3n..." });
    }
    /* if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace state={{ from: location }} />;
    } */
    return _jsx(Outlet, {});
};
