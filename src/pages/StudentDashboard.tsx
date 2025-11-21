import React from 'react';

export const StudentDashboard: React.FC = () => {
  return (
    <section>
      <h2>Panel de estudiante</h2>
      <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
        Aquí el estudiante verá sus instancias, queries recientes, tablas, colecciones, etc.
      </p>
      <div className="dashboard-placeholder">
        Placeholder del panel estudiante. Una vez tengas el backend listo, puedes cargar aquí la
        lista de motores asignados al usuario autenticado.
      </div>
    </section>
  );
};
