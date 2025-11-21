import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { User, UserRole } from '../types/auth';
import { authApi, type LoginPayload } from '../api/authApi';

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
      const storedToken = localStorage.getItem('easydb_token');
      const storedUser = localStorage.getItem('easydb_user');

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
        localStorage.removeItem('easydb_token');
        localStorage.removeItem('easydb_user');
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
    const { accessToken, user } = await authApi.login(payload);
    localStorage.setItem('easydb_token', accessToken);
    localStorage.setItem('easydb_user', JSON.stringify(user));

    setState({
      user,
      token: accessToken,
      isLoading: false
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('easydb_token');
    localStorage.removeItem('easydb_user');
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
