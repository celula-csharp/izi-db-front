import type { User } from "../types/auth";
import axiosClient from "./axiosClient";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: Date;
  user: User;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface RegisterResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  databaseInstances: [];
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await axiosClient.post<LoginResponse>(
      "/Users/login",
      payload
    );
    return data;
  },

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const { data } = await axiosClient.post<RegisterResponse>(
      "/Users",
      payload
    );
    return data;
  },

  async getCurrentUser(id: string): Promise<User> {
    const { data } = await axiosClient.get<User>(`/Users/${id}`);
    return data;
  },
};
