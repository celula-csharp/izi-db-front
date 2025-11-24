import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
export const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
    const [state, setState] = useState({
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
                const parsedUser = JSON.parse(storedUser);
                setState({
                    user: parsedUser,
                    token: storedToken,
                    isLoading: false
                });
                // Validar token opcionalmente
                await authApi.getCurrentUser();
            }
            catch {
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
    const login = useCallback(async (payload) => {
        const { accessToken, user } = await authApi.login(payload);
        localStorage.setItem('izi-db_token', accessToken);
        localStorage.setItem('izi-db_user', JSON.stringify(user));
        setState({
            user,
            token: accessToken,
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
    const hasRole = useCallback((roles) => {
        if (!state.user)
            return false;
        return roles.includes(state.user.role);
    }, [state.user]);
    const value = useMemo(() => ({
        ...state,
        isAuthenticated: Boolean(state.user && state.token),
        login,
        logout,
        hasRole
    }), [state, login, logout, hasRole]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
