import React from 'react';
import { Outlet } from 'react-router-dom';
import type { UserRole } from '../types/auth';
import {useAuth} from "@/auth/useAuth";

interface RoleGuardProps {
  roles: UserRole[];
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ roles }) => {
  const { user } = useAuth();

  console.log(user);
  console.log(roles);
  
  /* if (!user) {
    return <Navigate to="/auth/login" replace />;
  } */

  /* if (!roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  } */

  return <Outlet />;
};
