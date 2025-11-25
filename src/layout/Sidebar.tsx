import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'app-sidebar-link',
      isActive ? 'app-sidebar-link-active' : ''
    ]
      .filter(Boolean)
      .join(' ');

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
          <NavLink to="/" className={linkClass} end>
            Inicio
          </NavLink>

          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" className={linkClass}>
              Panel administrador
            </NavLink>
          )}

          {user?.role === 'STUDENT' && (
            <>
                <NavLink to="/student" className={linkClass}>
                    Panel estudiante
                </NavLink>
                <NavLink to="/student" className={linkClass}>
                    Panel estudiante
                </NavLink>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};
