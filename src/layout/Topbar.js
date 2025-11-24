import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router';
import { useAuth } from '../auth/useAuth';
export const Topbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    const initials = user?.name
        ? user.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase())
            .join('')
        : user?.email?.[0]?.toUpperCase() ?? 'E';
    return (_jsxs("header", { className: "app-topbar", children: [_jsxs("div", { children: [_jsx("div", { style: { fontSize: '0.9rem', fontWeight: 500 }, children: "Panel izi-db" }), _jsx("div", { style: { fontSize: '0.75rem', color: '#9ca3af' }, children: "Administra motores SQL y NoSQL desde una sola UI." })] }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }, children: [user && (_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '0.6rem' }, children: [_jsx("div", { style: {
                                    width: 26,
                                    height: 26,
                                    borderRadius: 999,
                                    background: '#020617',
                                    border: '1px solid #1f2937',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                }, children: initials }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column' }, children: [_jsx("span", { style: { fontSize: '0.8rem' }, children: user.name ?? user.email }), _jsx("span", { style: { fontSize: '0.7rem', color: '#9ca3af' }, children: user.role === 'ADMIN' ? 'Administrador' : 'Estudiante' })] })] })), _jsx("button", { type: "button", onClick: handleLogout, style: {
                            borderRadius: 999,
                            border: '1px solid #1f2937',
                            background: 'transparent',
                            color: '#e5e7eb',
                            padding: '0.35rem 0.7rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                        }, children: "Salir" })] })] }));
};
