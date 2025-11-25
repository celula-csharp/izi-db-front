import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LoginForm } from './LoginForm';
export const LoginPage = () => {
    return (_jsx("div", { className: "auth-page", children: _jsxs("div", { className: "auth-card", children: [_jsx("div", { className: "auth-card-title", children: "Login" }), _jsx("div", { className: "auth-card-subtitle", children: "Ingresa con tu cuenta para acceder al panel izi-db." }), _jsx(LoginForm, {})] }) }));
};
