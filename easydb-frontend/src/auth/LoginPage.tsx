import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { LoginForm, type LoginFormValues } from './LoginForm';

export const LoginPage: React.FC = () => {
  const { login, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;

  const handleLogin = async (values: LoginFormValues) => {
    await login(values);

    if (hasRole(['ADMIN'])) {
      navigate('/admin', { replace: true });
      return;
    }

    if (hasRole(['STUDENT'])) {
      navigate('/student', { replace: true });
      return;
    }

    const from = location.state?.from?.pathname ?? '/';
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-title">Login</div>
        <div className="auth-card-subtitle">
          Ingresa con tu cuenta para acceder al panel EasyDB.
        </div>
        <LoginForm onSubmit={handleLogin} />
      </div>
    </div>
  );
};
