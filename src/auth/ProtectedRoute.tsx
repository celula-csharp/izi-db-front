import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom'; // ✅ Importar Navigate y useLocation
import { useAuth } from './useAuth';

export const ProtectedRoute: React.FC = () => {
  // ✅ Asumimos que useAuth() proporciona 'isAuthenticated'
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div style={{ padding: 24 }}>Cargando sesión...</div>;
  }

  // ✅ DESCOMENTADO: Lógica de protección activa
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};