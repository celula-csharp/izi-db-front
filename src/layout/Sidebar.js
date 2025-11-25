import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
export const Sidebar = () => {
    const { user } = useAuth();
    const linkClass = ({ isActive }) => [
        'app-sidebar-link',
        isActive ? 'app-sidebar-link-active' : ''
    ]
        .filter(Boolean)
        .join(' ');
    return (_jsxs("aside", { className: "app-sidebar", children: [_jsxs("div", { className: "app-logo-row", children: [_jsx("div", { className: "app-logo-mark" }), _jsxs("div", { children: [_jsx("div", { className: "app-logo-text-main", children: "izi-db" }), _jsx("div", { className: "app-logo-text-sub", children: "Multi-motor DB Lab" })] })] }), _jsxs("div", { children: [_jsx("div", { className: "app-sidebar-section-title", children: "Navegaci\u00F3n" }), _jsxs("nav", { className: "app-sidebar-nav", children: [_jsx(NavLink, { to: "/", className: linkClass, end: true, children: "Inicio" }), user?.role === 'ADMIN' && (_jsx(NavLink, { to: "/admin", className: linkClass, children: "Panel administrador" })), user?.role === 'STUDENT' && (_jsxs(_Fragment, { children: [_jsx(NavLink, { to: "/student", className: linkClass, children: "Panel estudiante" }), _jsx(NavLink, { to: "/student", className: linkClass, children: "Panel estudiante" })] }))] })] })] }));
};
