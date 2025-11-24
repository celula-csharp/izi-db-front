import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { registerSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
export const RegisterPage = () => {
    const [showPass, setShowPass] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const { register, handleSubmit, formState: { errors }, } = useForm({
        resolver: zodResolver(registerSchema),
    });
    const onSubmit = (data) => {
        setSubmitting(true);
        try {
            console.log(data);
            alert("Registrado");
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }
            else {
                console.error(String(error));
            }
        }
        finally {
            setSubmitting(false);
        }
    };
    return (_jsx("div", { className: "auth-page", children: _jsxs("div", { className: "auth-card", children: [_jsx("div", { className: "auth-card-title", children: "Crear cuenta" }), _jsx("div", { className: "auth-card-subtitle", children: "Reg\u00EDstrate como estudiante para acceder a tu instancia asignada." }), _jsxs("form", { className: "auth-form", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { className: "auth-field", children: [_jsx("label", { className: "auth-label", htmlFor: "name", children: "Nombre" }), _jsx("input", { id: "name", className: "auth-input", placeholder: "Juan Estudiante", ...register("username"), required: true }), errors.username && (_jsx("p", { className: "text-red-500 text-sm", children: errors.username.message }))] }), _jsxs("div", { className: "auth-field", children: [_jsx("label", { className: "auth-label", htmlFor: "email", children: "Correo" }), _jsx("input", { id: "email", type: "email", className: "auth-input", placeholder: "tu@correo.com", ...register("email"), required: true }), errors.email && (_jsx("p", { className: "text-red-500 text-sm", children: errors.email.message }))] }), _jsxs("div", { className: "auth-field", children: [_jsx("label", { className: "auth-label", htmlFor: "password", children: "Contrase\u00F1a" }), _jsx("input", { id: "password", type: showPass ? "text" : "password", className: "auth-input", ...register("password"), required: true }), errors.password && (_jsx("p", { className: "text-red-500 text-sm", children: errors.password.message }))] }), _jsxs("div", { className: "auth-field", children: [_jsx("label", { className: "auth-label", htmlFor: "confirmPassword", children: "Confirmar contrase\u00F1a" }), _jsx("input", { id: "confirmPassword", type: showPass ? "text" : "password", className: "auth-input", ...register("confirmPassword"), required: true }), errors.confirmPassword && (_jsx("p", { className: "text-red-500 text-sm", children: errors.confirmPassword.message }))] }), _jsxs(Field, { orientation: "horizontal", children: [_jsx(Checkbox, { onCheckedChange: (checked) => setShowPass(Boolean(checked)), id: "show-password", checked: showPass }), _jsx(FieldLabel, { htmlFor: "show-password", className: "font-normal", children: "Mostrar contrase\u00F1as" })] }), _jsx("button", { className: "auth-submit", type: "submit", disabled: submitting, children: submitting ? "Creando cuenta…" : "Registrarme" }), _jsxs("span", { className: 'mx-auto text-center', children: ["\u00BFYa tienes una cuenta? ", _jsx("br", {}), _jsx(Link, { to: "/auth/login", className: "underline!", children: "Iniciar sesi\u00F3n" })] })] })] }) }));
};
