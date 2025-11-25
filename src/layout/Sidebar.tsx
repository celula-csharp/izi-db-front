import { FolderSearch, Home, LayoutDashboard, SquarePen } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    ["app-sidebar-link", isActive ? "app-sidebar-link-active" : ""]
      .filter(Boolean)
      .join(" ");

  const roleType = user?.role ?? "STUDENT";
  const rolePath = roleType.toLowerCase(); // Convertir a lowercase

  return (
    <aside className="app-sidebar">
      <div className="app-logo-row">
        <div className="app-logo-mark" />
        <div>
          <div className="app-logo-text-main">izi-db</div>
          <div className="app-logo-text-sub">Multi-motor DB Lab</div>
        </div>
      </div>

      <div>
        <div className="app-sidebar-section-title">Navegación</div>
        <nav className="app-sidebar-nav">
          <NavLink
            to={`/dashboard/${rolePath}/index`}
            className={linkClass}
            end
          >
            <Home className="svg" />
            Inicio
          </NavLink>

          {user?.role === "ADMIN" && (
            <NavLink to="/admin" className={linkClass}>
              Panel administrador
            </NavLink>
          )}

          {user?.role === "STUDENT" && (
            <>
              <NavLink
                to={`/dashboard/${rolePath}/dashboard`}
                className={linkClass}
              >
                <LayoutDashboard className="svg" />
                Dashboard
              </NavLink>
              <NavLink
                to={`/dashboard/${rolePath}/query`}
                className={linkClass}
              >
                <SquarePen className="svg" />
                Query Editor
              </NavLink>
              <NavLink to={`/dashboard/${rolePath}/data`} className={linkClass}>
                <FolderSearch className="svg" />
                Data explorer
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};
