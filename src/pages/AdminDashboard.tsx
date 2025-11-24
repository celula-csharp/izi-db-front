import React from 'react';

export const AdminDashboard: React.FC = () => {
  return (
    <section>
      <h2>Panel de administrador</h2>
      <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
        Aquí irán las vistas para crear instancias, asignar estudiantes, ver logs, etc.
      </p>
      <div className="dashboard-placeholder">
        Placeholder del panel admin. Tu parte ahora mismo es principalmente el flujo de auth,
        layouts y route guards. Luego puedes conectar esto con las APIs reales de tu backend .NET.
      </div>
    </section>
  );
};
