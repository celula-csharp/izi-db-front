import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi, type LoginPayload } from '../api/authApi';
import type { User, UserRole } from '../types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true
  });

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem('izi-db_token');
      const storedUser = localStorage.getItem('izi-db_user');

      if (!storedToken || !storedUser) {
        setState((s) => ({ ...s, isLoading: false }));
        return;
      }

      try {
        const parsedUser: User = JSON.parse(storedUser);
        setState({
          user: parsedUser,
          token: storedToken,
          isLoading: false
        });

        // Validar token opcionalmente
        await authApi.getCurrentUser();
      } catch {
        localStorage.removeItem('izi-db_token');
        localStorage.removeItem('izi-db_user');
        setState({
          user: null,
          token: null,
          isLoading: false
        });
      }
    };

    void bootstrap();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const { token, user } = await authApi.login(payload);

    console.log(token)

    localStorage.setItem('izi-db_token', token);
    localStorage.setItem('izi-db_user', JSON.stringify(user));

    setState({
      user,
      token: token,
      isLoading: false
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('izi-db_token');
    localStorage.removeItem('izi-db_user');
    setState({
      user: null,
      token: null,
      isLoading: false
    });
  }, []);

  const hasRole = useCallback(
    (roles: UserRole[]) => {
      if (!state.user) return false;
      return roles.includes(state.user.role);
    },
    [state.user]
  );

  const value: AuthContextValue = useMemo(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.user && state.token),
      login,
      logout,
      hasRole
    }),
    [state, login, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
