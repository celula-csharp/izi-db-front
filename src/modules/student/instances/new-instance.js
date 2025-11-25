import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { studentService } from "@/api/studentService";
import { useAuth } from "@/auth/useAuth";
import { ArrowLeft, Database } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function NewInstance() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError("El nombre es requerido");
            return;
        }
        if (!user?.id) {
            setError("Usuario no autenticado");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            await studentService.createInstance(formData.name.trim(), formData.description.trim(), user.id);
            navigate("/dashboard/student");
        }
        catch (err) {
            console.error("Error creating instance:", err);
            setError(err.response?.data?.message ||
                "Error al crear la instancia. Por favor, intenta nuevamente.");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleCancel = () => {
        navigate(-1);
    };
    return (_jsx("div", { className: "min-h-screen bg-gray-900 py-8", children: _jsxs("div", { className: "max-w-2xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "mb-8", children: [_jsxs("button", { onClick: handleCancel, className: "flex items-center text-gray-400 hover:text-gray-200 mb-4 transition-colors", children: [_jsx(ArrowLeft, { className: "w-5 h-5 mr-2" }), "Volver"] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-3 bg-blue-900/50 rounded-lg", children: _jsx(Database, { className: "w-8 h-8 text-blue-400" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Nueva Instancia de Base de Datos" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Crea una nueva instancia para trabajar con diferentes motores de base de datos" })] })] })] }), _jsx("div", { className: "bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [error && (_jsx("div", { className: "bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md", children: error })), _jsxs("div", { children: [_jsx("label", { htmlFor: "name", className: "block text-sm font-medium text-gray-300 mb-2", children: "Nombre de la instancia *" }), _jsx("input", { type: "text", id: "name", name: "name", value: formData.name, onChange: handleInputChange, placeholder: "Ej: Mi Base de Datos Principal", className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50", disabled: isLoading, maxLength: 100, required: true }), _jsxs("p", { className: "text-xs text-gray-400 mt-1", children: [formData.name.length, "/100 caracteres"] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "description", className: "block text-sm font-medium text-gray-300 mb-2", children: "Descripci\u00F3n" }), _jsx("textarea", { id: "description", name: "description", value: formData.description, onChange: handleInputChange, placeholder: "Describe el prop\u00F3sito de esta instancia de base de datos...", rows: 4, className: "w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-50", disabled: isLoading, maxLength: 500 }), _jsxs("p", { className: "text-xs text-gray-400 mt-1", children: [formData.description.length, "/500 caracteres"] })] }), _jsxs("div", { className: "bg-gray-700/50 p-4 rounded-md", children: [_jsx("h3", { className: "text-sm font-medium text-gray-300 mb-2", children: "Informaci\u00F3n del propietario" }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("span", { className: "text-gray-400", children: "Usuario:" }), _jsx("p", { className: "font-medium text-white", children: user?.name || "N/A" })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-400", children: "Email:" }), _jsx("p", { className: "font-medium text-white", children: user?.email || "N/A" })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-400", children: "Rol:" }), _jsx("p", { className: "font-medium text-white", children: user?.role || "N/A" })] }), _jsxs("div", { children: [_jsx("span", { className: "text-gray-400", children: "ID:" }), _jsx("p", { className: "font-medium text-white text-xs truncate", children: user?.id || "N/A" })] })] })] }), _jsxs("div", { className: "flex gap-3 pt-4", children: [_jsx("button", { type: "button", onClick: handleCancel, disabled: isLoading, className: "flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: "Cancelar" }), _jsx("button", { type: "submit", disabled: isLoading || !formData.name.trim(), className: "flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: isLoading ? (_jsxs("span", { className: "flex items-center justify-center", children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" }), "Creando..."] })) : ("Crear Instancia") })] })] }) }), _jsxs("div", { className: "mt-6 bg-blue-900/30 border border-blue-700 rounded-lg p-4", children: [_jsx("h3", { className: "text-sm font-medium text-blue-300 mb-2", children: "\u00BFQu\u00E9 es una instancia?" }), _jsx("p", { className: "text-sm text-blue-200", children: "Una instancia es un entorno aislado donde puedes trabajar con diferentes motores de base de datos. Cada instancia tiene sus propias tablas, colecciones y datos independientes." })] })] }) }));
}
