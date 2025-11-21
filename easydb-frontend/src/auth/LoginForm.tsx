import React, { useState } from 'react';

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [values, setValues] = useState<LoginFormValues>({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ??
        err?.message ??
        'No se pudo iniciar sesión. Revisa tus credenciales.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label className="auth-label" htmlFor="email">
          Correo
        </label>
        <input
          className="auth-input"
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="admin@easydb.local"
          value={values.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="password">
          Contraseña
        </label>
        <input
          className="auth-input"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          onChange={handleChange}
          required
        />
      </div>

      {error && <div className="auth-error">{error}</div>}

      <button className="auth-submit" type="submit" disabled={submitting}>
        {submitting ? 'Iniciando sesión…' : 'Entrar a EasyDB'}
      </button>
    </form>
  );
};
