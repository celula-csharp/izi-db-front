import { jsx as _jsx } from "react/jsx-runtime";
import { Outlet, Navigate, useLocation } from 'react-router-dom'; // ✅ Importar Navigate y useLocation
import { useAuth } from './useAuth';
export const ProtectedRoute = () => {
    // ✅ Asumimos que useAuth() proporciona 'isAuthenticated'
    const { isLoading, isAuthenticated } = useAuth();
    const location = useLocation();
    if (isLoading) {
        return _jsx("div", { style: { padding: 24 }, children: "Cargando sesi\u00F3n..." });
    }
    // ✅ DESCOMENTADO: Lógica de protección activa
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/auth/login", replace: true, state: { from: location } });
    }
    return _jsx(Outlet, {});
};
