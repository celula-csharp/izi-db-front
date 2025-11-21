import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    ['public-nav-link', isActive ? 'public-nav-link-active' : '']
      .filter(Boolean)
      .join(' ');

  return (
    <div className="public-root">
      <header className="public-navbar">
        <div className="public-nav-left">
          <Link to="/" className="public-logo">
            <div className="public-logo-mark" />
            <div className="public-logo-text">
              <span className="public-logo-title">EasyDB</span>
              <span className="public-logo-subtitle">Multi-Motor DB Lab</span>
            </div>
          </Link>
        </div>

        <nav className="public-nav-center">
          <NavLink to="/" className={navLinkClass} end>
            Inicio
          </NavLink>
          <a href="#motores" className="public-nav-link">
            Motores
          </a>
          <a href="#roles" className="public-nav-link">
            Roles
          </a>
        </nav>

        <div className="public-nav-right">
          <NavLink to="/login" className={navLinkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className="public-nav-cta">
            Registrarse
          </NavLink>
        </div>
      </header>

      <main className="public-main">
        <div className="public-main-inner">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
