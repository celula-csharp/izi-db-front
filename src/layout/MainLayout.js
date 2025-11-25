import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
export const MainLayout = () => {
    return (_jsxs("div", { className: "app-shell", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "app-main", children: [_jsx(Topbar, {}), _jsx("main", { className: "app-content", children: _jsx(Outlet, {}) })] })] }));
};
