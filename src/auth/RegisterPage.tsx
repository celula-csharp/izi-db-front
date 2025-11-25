import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { registerSchema } from "@/schemas";
import { RegisterFormValues } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./useAuth";

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerAsync } = useAuth();
  const [showPass, setShowPass] = React.useState<boolean>(false);
  const [submitting, setSubmitting] = React.useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        role: "STUDENT" as const, // Agregar role manualmente
      };
      console.log(payload);
      await registerAsync(payload);
      navigate("/auth/login");
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
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card-title">Crear cuenta</div>
        <div className="auth-card-subtitle">
          Regístrate como estudiante para acceder a tu instancia asignada.
        </div>

        <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="name">
              Nombre
            </label>
            <input
              id="name"
              className="auth-input"
              placeholder="Juan Estudiante"
              {...register("username")}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              Correo
            </label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="tu@correo.com"
              {...register("email")}
              required
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
              id="password"
              type={showPass ? "text" : "password"}
              className="auth-input"
              {...register("password")}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="confirmPassword">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type={showPass ? "text" : "password"}
              className="auth-input"
              {...register("confirmPassword")}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
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
            {submitting ? "Creando cuenta…" : "Registrarme"}
          </button>
          <span className="mx-auto text-center">
            ¿Ya tienes una cuenta? <br />
            <Link to="/auth/login" className="underline!">
              Iniciar sesión
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};
