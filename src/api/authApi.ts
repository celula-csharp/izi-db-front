import axiosClient from './axiosClient';
import type { User } from '../types/auth';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiration: Date;
  user: User;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await axiosClient.post<LoginResponse>('/Users/login', payload);
    return data;
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await axiosClient.get<User>("/Users/me");
    return data;
  }
};
