import React, { useState } from 'react';

interface RegisterValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage: React.FC = () => {
  const [values, setValues] = useState<RegisterValues>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

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

    if (values.password !== values.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);
    try {
      // Aquí debería ir la llamada real a tu backend: /auth/register
      // De momento solo mostramos un aviso para que el front no se rompa.
      // eslint-disable-next-line no-alert
      alert('Aquí llamarías al endpoint /auth/register del backend .NET.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-title">Crear cuenta</div>
        <div className="auth-card-subtitle">
          Regístrate como estudiante para acceder a tu instancia asignada.
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              name="name"
              className="auth-input"
              value={values.name}
              onChange={handleChange}
              placeholder="Juan Estudiante"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="auth-input"
              value={values.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-input"
              value={values.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="confirmPassword">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="auth-input"
              value={values.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Creando cuenta…' : 'Registrarme'}
          </button>
        </form>
      </div>
    </div>
  );
};
