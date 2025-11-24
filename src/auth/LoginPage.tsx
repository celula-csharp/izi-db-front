import React from 'react';
import { LoginForm } from './LoginForm';

export const LoginPage: React.FC = () => {

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-title">Login</div>
        <div className="auth-card-subtitle">
          Ingresa con tu cuenta para acceder al panel izi-db.
        </div>
        <LoginForm />
      </div>
    </div>
  );
};
