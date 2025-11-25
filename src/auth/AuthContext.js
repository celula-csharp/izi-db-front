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
    // Función para parsear usuario con valor por defecto
    const parseStoredUser = (storedUser) => {
        const userData = JSON.parse(storedUser);
        return {
            ...userData,
            role: userData.role ?? 'STUDENT' // Valor por defecto para role null/undefined
        };
    };
    useEffect(() => {
        const bootstrap = async () => {
            const storedToken = localStorage.getItem('izi-db_token');
            const storedUser = localStorage.getItem('izi-db_user');
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
                    isLoading: false
                });
            }
            catch (error) {
                console.error('Error during auth bootstrap:', error);
                // Limpiar datos inválidos
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
        try {
            const { token, user } = await authApi.login(payload);
            // Asegurar que el usuario tenga un role por defecto
            const userWithDefaultRole = {
                ...user,
                role: user.role ?? 'STUDENT'
            };
            localStorage.setItem('izi-db_token', token);
            localStorage.setItem('izi-db_user', JSON.stringify(userWithDefaultRole));
            setState({
                user: userWithDefaultRole,
                token,
                isLoading: false
            });
        }
        catch (error) {
            console.error('Login error:', error);
            throw error; // Re-lanzar el error para manejarlo en el componente
        }
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
        return state.user ? roles.includes(state.user.role) : false;
    }, [state.user]);
    const value = useMemo(() => ({
        ...state, // Spread state para evitar duplicación
        isAuthenticated: Boolean(state.user && state.token),
        login,
        logout,
        hasRole
    }), [state, login, logout, hasRole]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
