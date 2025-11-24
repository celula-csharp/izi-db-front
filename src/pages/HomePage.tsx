import React from 'react';
import { useNavigate } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-root">
      {/* Hero principal, centrado */}
      <section className="home-hero">
        <div className="home-hero-main">
          <p className="home-hero-pill">
            <span className="home-hero-pill-text">Plataforma multi-motor · EasyDB</span>
          </p>

          <h1 className="home-hero-title">
            Orquesta instancias de bases de datos.
            <span className="home-hero-highlight"> ¡Como si fuera tu propio cloud!</span>
          </h1>

          <p className="home-hero-subtitle">
            Admin crea contenedores de SQL Server, PostgreSQL, MySQL, MongoDB y Redis para cada
            estudiante. Cada uno entra con su cuenta y administra solo su motor.
          </p>

          <div className="home-hero-actions">
            <button
              type="button"
              className="home-hero-primary"
              onClick={() => navigate('/login')}
            >
              Entrar al panel
            </button>

            <button
              type="button"
              className="home-hero-secondary"
              onClick={() => navigate('/register')}
            >
              Crear cuenta de estudiante
            </button>
          </div>

          <div className="home-hero-tags">
            <span className="home-tag home-tag-pulse-1">JWT + roles</span>
            <span className="home-tag home-tag-pulse-2">React + .NET</span>
            <span className="home-tag home-tag-pulse-3">Docker · Instancias aisladas</span>
          </div>
        </div>
      </section>

      {/* Estado del laboratorio: debajo del hero, centrado */}
      <section className="lab-status-section">
        <div className="lab-status-inner">
          <div className="home-hero-card">
            <div className="home-hero-card-header">
              <span className="home-hero-card-title">Estado del laboratorio</span>
              <span className="home-hero-dot" />
            </div>

            <div className="home-hero-metrics">
              <div className="home-hero-metric">
                <span className="home-hero-metric-label">Motores activos</span>
                <span className="home-hero-metric-value">5</span>
                <span className="home-hero-metric-foot">SQL · NoSQL</span>
              </div>
              <div className="home-hero-metric">
                <span className="home-hero-metric-label">Estudiantes online</span>
                <span className="home-hero-metric-value">18</span>
                <span className="home-hero-metric-foot">sesiones concurrentes</span>
              </div>
              <div className="home-hero-metric">
                <span className="home-hero-metric-label">Queries procesadas</span>
                <span className="home-hero-metric-value">12.4k</span>
                <span className="home-hero-metric-foot">últimas 24 horas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motores soportados */}
      <section id="motores" className="home-section">
        <div className="home-section-header">
          <h2>Motores de base de datos</h2>
          <p>Lo mínimo que soporta el taller de EasyDB.</p>
        </div>
        <div className="home-chips-row">
          <span className="home-chip">SQL Server</span>
          <span className="home-chip">PostgreSQL</span>
          <span className="home-chip">MySQL / MariaDB</span>
          <span className="home-chip">MongoDB</span>
          <span className="home-chip">Redis</span>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="home-section home-section-grid">
        <article className="home-card">
          <h3>Administrador</h3>
          <p>
            Crea instancias Docker, asigna contenedores a estudiantes, enciende y apaga motores y
            consulta logs desde un solo panel.
          </p>
          <ul>
            <li>Alta de instancias por motor y puerto</li>
            <li>Asignación por estudiante</li>
            <li>Reinicio y eliminación de contenedores</li>
            <li>Visualización de logs</li>
          </ul>
        </article>

        <article className="home-card">
          <h3>Estudiante</h3>
          <p>
            Ve solo su motor asignado, ejecuta queries con editor integrado y hace CRUD visual
            sobre tablas o colecciones.
          </p>
          <ul>
            <li>Editor de queries (SQL / Mongo / Redis)</li>
            <li>Tablas dinámicas para explorar datos</li>
            <li>Edición, creación y eliminación de registros</li>
            <li>Exportación de datos</li>
          </ul>
        </article>
      </section>
    </div>
  );
};
