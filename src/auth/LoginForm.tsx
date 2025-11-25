import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { loginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {useAuth} from "@/auth/useAuth";
import { useNavigate } from 'react-router';

export interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPass, setShowPass] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    setSubmitting(true);
    
    
    try {
      console.log(data);
      await login(data);

      navigate("/dashboard/student")
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(String(error));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="auth-field">
        <label className="auth-label" htmlFor="email">
          Correo
        </label>
        <input
          className="auth-input"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@izi-db.local"
          required
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="password">
          Contraseña
        </label>
        <input
          className="auth-input"
          id="password"
          type={showPass ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          required
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <Field orientation="horizontal">
        <Checkbox
          onCheckedChange={(checked) => setShowPass(Boolean(checked))}
          id="show-password"
          checked={showPass}
        />
        <FieldLabel htmlFor="show-password" className="font-normal">
          Mostrar contraseñas
        </FieldLabel>
      </Field>

      <button className="auth-submit" type="submit" disabled={submitting}>
        {submitting ? 'Iniciando sesión…' : 'Entrar a izi-db'}
      </button>
    </form>
  );
};
