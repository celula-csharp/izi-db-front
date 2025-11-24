import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth';

export const Topbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/")
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join('')
    : user?.email?.[0]?.toUpperCase() ?? 'E';

  return (
    <header className="app-topbar">
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Panel izi-db</div>
        <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
          Administra motores SQL y NoSQL desde una sola UI.
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                background: '#020617',
                border: '1px solid #1f2937',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {initials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem' }}>{user.name ?? user.email}</span>
              <span style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                {user.role === 'ADMIN' ? 'Administrador' : 'Estudiante'}
              </span>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          style={{
            borderRadius: 999,
            border: '1px solid #1f2937',
            background: 'transparent',
            color: '#e5e7eb',
            padding: '0.35rem 0.7rem',
            fontSize: '0.75rem',
            cursor: 'pointer'
          }}
        >
          Salir
        </button>
      </div>
    </header>
  );
};
