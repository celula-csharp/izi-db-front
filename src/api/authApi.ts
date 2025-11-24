import axiosClient from './axiosClient';
import type { User } from '../types/auth';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await axiosClient.post<LoginResponse>('/auth/login', payload);
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await axiosClient.get<User>('/auth/me');
    return data;
  }
};
