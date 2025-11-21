import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';
import type { UserRole } from '../types/auth';

interface RoleGuardProps {
  roles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
