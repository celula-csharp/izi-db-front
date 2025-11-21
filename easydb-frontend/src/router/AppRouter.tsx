import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import { RoleGuard } from '../auth/RoleGuard';
import { MainLayout } from '../layout/MainLayout';
import { AuthLayout } from '../layout/AuthLayout';
import { LoginPage } from '../auth/LoginPage';
import { RegisterPage } from '../auth/RegisterPage';
import { HomePage } from '../pages/HomePage';
import { AdminDashboard } from '../pages/AdminDashboard';
import { StudentDashboard } from '../pages/StudentDashboard';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas: landing + login + register */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route element={<RoleGuard roles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<RoleGuard roles={['STUDENT']} />}>
            <Route path="/student" element={<StudentDashboard />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};
