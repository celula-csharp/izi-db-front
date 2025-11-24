import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';

export const AuthLayout: React.FC = () => {


  return (
    <div className="public-root">
      <header className="public-navbar">
        <div className="public-nav-left">
          <Link to="/" className="public-logo">
            <div className="public-logo-mark" />
            <div className="public-logo-text">
              <span className="public-logo-title">izi-db</span>
              <span className="public-logo-subtitle">Multi-Motor DB Lab</span>
            </div>
          </Link>
        </div>

        <nav className="public-nav-center">
          <NavLink to="/" className="public-nav-link">
            Inicio
          </NavLink>
          <NavLink to="/#motores" className="public-nav-link">
            Motores
          </NavLink>
          <NavLink to="/#roles" className="public-nav-link">
            Roles
          </NavLink>
        </nav>

        <div className="public-nav-right">
          <NavLink to="/auth/login">Iniciar sesión</NavLink>
          <NavLink to="/auth/register" className="public-nav-cta">
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
