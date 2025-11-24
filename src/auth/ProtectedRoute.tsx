import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

export const ProtectedRoute: React.FC = () => {
  const { isLoading } = useAuth();
  // const location = useLocation();

  if (isLoading) {
    return <div style={{ padding: 24 }}>Cargando sesión...</div>;
  }

  /* if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  } */

  return <Outlet />;
};
