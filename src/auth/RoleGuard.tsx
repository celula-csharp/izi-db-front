import React from 'react';
import { Outlet } from 'react-router-dom';
import type { UserRole } from '../types/auth';

interface RoleGuardProps {
  roles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ roles }) => {
  console.log(roles)
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
