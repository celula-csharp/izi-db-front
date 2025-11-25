import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { loginSchema } from '@/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from "@/auth/useAuth";
import { useNavigate } from 'react-router';
export const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPass, setShowPass] = React.useState(false);
    const [submitting, setSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
    });
    const onSubmit = async (data) => {
        setSubmitting(true);
        try {
            console.log(data);
            await login(data);
            navigate("/dashboard/student");
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
    return (_jsxs("form", { className: "auth-form", onSubmit: handleSubmit(onSubmit), children: [_jsxs("div", { className: "auth-field", children: [_jsx("label", { className: "auth-label", htmlFor: "email", children: "Correo" }), _jsx("input", { className: "auth-input", id: "email", type: "email", autoComplete: "email", placeholder: "admin@izi-db.local", required: true, ...register("email") }), errors.email && (_jsx("p", { className: "text-red-500 text-sm", children: errors.email.message }))] }), _jsxs("div", { className: "auth-field", children: [_jsx("label", { className: "auth-label", htmlFor: "password", children: "Contrase\u00F1a" }), _jsx("input", { className: "auth-input", id: "password", type: showPass ? "text" : "password", autoComplete: "current-password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, ...register("password") }), errors.password && (_jsx("p", { className: "text-red-500 text-sm", children: errors.password.message }))] }), _jsxs(Field, { orientation: "horizontal", children: [_jsx(Checkbox, { onCheckedChange: (checked) => setShowPass(Boolean(checked)), id: "show-password", checked: showPass }), _jsx(FieldLabel, { htmlFor: "show-password", className: "font-normal", children: "Mostrar contrase\u00F1as" })] }), _jsx("button", { className: "auth-submit", type: "submit", disabled: submitting, children: submitting ? 'Iniciando sesión…' : 'Entrar a izi-db' })] }));
};
