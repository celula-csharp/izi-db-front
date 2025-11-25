import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authApi, RegisterPayload, type LoginPayload } from "../api/authApi";
import type { User, UserRole } from "../types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  // Función para parsear usuario con valor por defecto
  const parseStoredUser = (storedUser: string): User => {
    const userData = JSON.parse(storedUser);
    return {
      ...userData,
      role: userData.role ?? "STUDENT", // Valor por defecto para role null/undefined
    };
  };

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem("izi-db_token");
      const storedUser = localStorage.getItem("izi-db_user");

      if (!storedToken || !storedUser) {
        setState((s) => ({ ...s, isLoading: false }));
        return;
      }

      try {
        const parsedUser = parseStoredUser(storedUser);

        // Validar token con la API
        await authApi.getCurrentUser(parsedUser.id);

        setState({
          user: parsedUser,
          token: storedToken,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error during auth bootstrap:", error);
        // Limpiar datos inválidos
        localStorage.removeItem("izi-db_token");
        localStorage.removeItem("izi-db_user");
        setState({
          user: null,
          token: null,
          isLoading: false,
        });
      }
    };

    void bootstrap();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    try {
      const { token, user } = await authApi.login(payload);

      // Asegurar que el usuario tenga un role por defecto
      const userWithDefaultRole: User = {
        ...user,
        role: user.role ?? "STUDENT",
      };

      localStorage.setItem("izi-db_token", token);
      localStorage.setItem("izi-db_user", JSON.stringify(userWithDefaultRole));

      setState({
        user: userWithDefaultRole,
        token,
        isLoading: false,
      });
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    try {
      await authApi.register(payload);
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Re-lanzar el error para manejarlo en el componente
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("izi-db_token");
    localStorage.removeItem("izi-db_user");
    setState({
      user: null,
      token: null,
      isLoading: false,
    });
  }, []);

  const hasRole = useCallback(
    (roles: UserRole[]) => {
      return state.user ? roles.includes(state.user.role) : false;
    },
    [state.user]
  );

  const value: AuthContextValue = useMemo(
    () => ({
      ...state, // Spread state para evitar duplicación
      isAuthenticated: Boolean(state.user && state.token),
      login,
      register,
      logout,
      hasRole,
    }),
    [state, login, register, logout, hasRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
