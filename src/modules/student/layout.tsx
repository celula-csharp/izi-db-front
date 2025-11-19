import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";

const menuItems = [
    { label: "Dashboard", to: "/student/dashboard", icon: "📊" },
    { label: "Query Editor", to: "/student/query", icon: "📝" },
    { label: "Data Explorer", to: "/student/data", icon: "📁" },
];

export default function StudentLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex w-full h-screen bg-[#0f111a] text-white">

            {/* --- SIDEBAR --- */}
            <aside
                className={`transition-all duration-300 bg-[#151823] border-r border-gray-700
        ${sidebarOpen ? "w-64" : "w-16"} flex flex-col`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`font-bold text-xl transition-all duration-300 ${!sidebarOpen && "hidden"}`}>
            Student Panel
          </span>

                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-400 hover:text-white text-xl"
                    >
                        {sidebarOpen ? "«" : "»"}
                    </button>
                </div>

                <nav className="flex-1 flex flex-col p-2 gap-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium
                transition-all ${
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                }`
                            }
                        >
                            <span className="text-lg">{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
                    {sidebarOpen && <p>© 2025 IziDB</p>}
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col">

                {/* TOPBAR */}
                <header className="h-16 border-b border-gray-700 flex items-center px-6 bg-[#151823]">
                    <h1 className="text-xl font-semibold">Student Dashboard</h1>
                </header>

                {/* CONTENT */}
                <div className="flex-1 overflow-auto p-6">
                    <Outlet />
                </div>

            </main>
        </div>
    );
}
