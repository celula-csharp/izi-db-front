import { loginSchema, registerSchema } from "@/schemas";
import type z from "zod";
export type UserRole = 'ADMIN' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
export type Login = {
  email: string;
  password: string;
}
