import React from 'react';
import { Outlet } from 'react-router-dom';
import type { UserRole } from '../types/auth';

interface RoleGuardProps {
  roles: UserRole[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const RoleGuard: React.FC<RoleGuardProps> = ({ roles }) => {
  // TODO
  //const { user } = useAuth();

  /* if (!user) {
    return <Navigate to="/auth/login" replace />;
  } */

  /* if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  } */

  return <Outlet />;
};
