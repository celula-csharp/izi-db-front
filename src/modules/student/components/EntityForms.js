import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export default function EntityForm({ entityName, schema, initialData = null, onSubmit, onClose }) {
    const [formData, setFormData] = useState(initialData || {});
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // 1. AJUSTE: Añadir el campo 'createdAt' con la fecha actual del usuario
        //    (Solo si estamos creando un nuevo registro y no editando)
        let finalData = formData;
        if (!initialData) {
            // Formato 'YYYY-MM-DD' para que coincida con los datos existentes
            const date = new Date().toISOString().slice(0, 10);
            finalData = { ...formData, createdAt: date };
        }
        // 2. AJUSTE: Eliminar campos que deben ser generados por el backend (como 'id') si están en el formData
        delete finalData.id;
        onSubmit(finalData);
    };
    // Lista de campos a EXCLUIR de la interfaz del formulario
    const fieldsToExclude = ['createdAt', 'id'];
    return (_jsxs("div", { className: "flex-1 p-6", children: [_jsxs("h2", { className: "text-xl font-semibold mb-4 text-white", children: [initialData ? "Editar registro" : "Crear nuevo registro", " en", " ", _jsx("span", { className: "text-blue-400", children: entityName })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 bg-[#202534] shadow-xl p-6 rounded-lg border border-gray-700", children: [schema
                        // AJUSTE: Filtrar campos que no deben ser editados/mostrados en el formulario
                        ?.filter(field => !fieldsToExclude.includes(field.name) && field.name !== 'notes') // <-- Excluye 'notes' si sigue en el esquema
                        .map((field) => (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "font-medium text-gray-300 mb-1", children: field.name.charAt(0).toUpperCase() + field.name.slice(1).replace('_', ' ') }), field.type === "boolean" ? (_jsxs("select", { className: "border rounded px-3 py-2 bg-gray-800 text-white border-gray-700", value: formData[field.name] ?? "", onChange: (e) => handleChange(field.name, e.target.value === "true"), children: [_jsx("option", { value: "", children: "Seleccione\u2026" }), _jsx("option", { value: "true", children: "S\u00ED" }), _jsx("option", { value: "false", children: "No" })] })) : (_jsx("input", { type: field.type === "number" ? "number" : "text", className: "border rounded px-3 py-2 bg-gray-800 text-white border-gray-700", value: formData[field.name] ?? "", onChange: (e) => handleChange(field.name, field.type === "number" ? Number(e.target.value) : e.target.value) }))] }, field.name))), initialData && initialData.createdAt && (_jsxs("div", { className: "flex flex-col", children: [_jsx("label", { className: "font-medium text-gray-300 mb-1", children: "Fecha de Creaci\u00F3n" }), _jsx("p", { className: "px-3 py-2 text-gray-400 bg-gray-800 border border-gray-700 rounded", children: initialData.createdAt })] })), _jsxs("div", { className: "flex justify-end pt-4 space-x-3", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition", children: "Cancelar" }), _jsx("button", { type: "submit", className: "px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition", children: initialData ? "Guardar cambios" : "Crear registro" })] })] })] }));
}
