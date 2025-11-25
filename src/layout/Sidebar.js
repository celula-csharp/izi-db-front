import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { FolderSearch, Home, LayoutDashboard, SquarePen } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
export const Sidebar = () => {
    const { user } = useAuth();
    const linkClass = ({ isActive }) => ["app-sidebar-link", isActive ? "app-sidebar-link-active" : ""]
        .filter(Boolean)
        .join(" ");
    const roleType = user?.role ?? "STUDENT";
    const rolePath = roleType.toLowerCase(); // Convertir a lowercase
    return (_jsxs("aside", { className: "app-sidebar", children: [_jsxs("div", { className: "app-logo-row", children: [_jsx("div", { className: "app-logo-mark" }), _jsxs("div", { children: [_jsx("div", { className: "app-logo-text-main", children: "izi-db" }), _jsx("div", { className: "app-logo-text-sub", children: "Multi-motor DB Lab" })] })] }), _jsxs("div", { children: [_jsx("div", { className: "app-sidebar-section-title", children: "Navegaci\u00F3n" }), _jsxs("nav", { className: "app-sidebar-nav", children: [_jsxs(NavLink, { to: `/dashboard/${rolePath}/index`, className: linkClass, end: true, children: [_jsx(Home, { className: "svg" }), "Inicio"] }), user?.role === "ADMIN" && (_jsx(NavLink, { to: "/admin", className: linkClass, children: "Panel administrador" })), user?.role === "STUDENT" && (_jsxs(_Fragment, { children: [_jsxs(NavLink, { to: `/dashboard/${rolePath}/dashboard`, className: linkClass, children: [_jsx(LayoutDashboard, { className: "svg" }), "Dashboard"] }), _jsxs(NavLink, { to: `/dashboard/${rolePath}/query`, className: linkClass, children: [_jsx(SquarePen, { className: "svg" }), "Query Editor"] }), _jsxs(NavLink, { to: `/dashboard/${rolePath}/data`, className: linkClass, children: [_jsx(FolderSearch, { className: "svg" }), "Data explorer"] })] }))] })] })] }));
};
