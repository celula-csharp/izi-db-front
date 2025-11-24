import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio.")
    .email("Correo inválido"),
  password: z
    .string()
    .min(6, "Mínimmo 6 caracteres.")
    .max(50, "Máximo 50 caracteres."),
});
