import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
const menuItems = [
    { label: "Dashboard", to: "/dashboard/student/dashboard", icon: "📊" },
    { label: "Query Editor", to: "/dashboard/student/query", icon: "✏️" },
    { label: "Data Explorer", to: "/dashboard/student/data", icon: "🔍" },
];
export default function StudentLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    return (_jsxs("div", { className: "flex w-full h-screen bg-[#0f111a] text-white", children: [_jsxs("aside", { className: `transition-all duration-300 bg-[#151823] border-r border-gray-700
        ${sidebarOpen ? "w-64" : "w-16"} flex flex-col`, children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-gray-700", children: [_jsx("span", { className: `font-bold text-xl transition-all duration-300 ${!sidebarOpen && "hidden"}`, children: "Student Panel" }), _jsx("button", { onClick: () => setSidebarOpen(!sidebarOpen), className: "text-gray-400 hover:text-white text-xl", children: sidebarOpen ? "«" : "»" })] }), _jsx("nav", { className: "flex-1 flex flex-col p-2 gap-1", children: menuItems.map((item) => (_jsxs(NavLink, { to: item.to, className: ({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium
                transition-all ${isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white"}`, children: [_jsx("span", { className: "text-lg", children: item.icon }), sidebarOpen && _jsx("span", { children: item.label })] }, item.to))) }), _jsx("div", { className: "p-4 border-t border-gray-700 text-sm text-gray-400", children: sidebarOpen && _jsx("p", { children: "\u00A9 2025 IziDB" }) })] }), _jsxs("main", { className: "flex-1 flex flex-col", children: [_jsx("header", { className: "h-16 border-b border-gray-700 flex items-center px-6 bg-[#151823]", children: _jsx("h1", { className: "text-xl font-semibold", children: "Student Dashboard" }) }), _jsx("div", { className: "flex-1 overflow-auto p-6", children: _jsx(Outlet, {}) })] })] }));
}
