import { z } from "zod";

export const registerSchema = z
  .object({
    username: z
      .string("Valor inválido.")
      .min(1, "El nombre de usuario es obligatorio.")
      .max(20, "Máximo 20 carácteres."),
    email: z
      .string("Valor inválido.")
      .min(1, "El correo es obligatorio.")
      .email("Correo inválido"),
    password: z
      .string("Valor inválido.")
      .min(6, "Mínimo 6 caracteres.")
      .max(50, "Máximo 50 caracteres."),

    confirmPassword: z.string("Valor inválido."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });
