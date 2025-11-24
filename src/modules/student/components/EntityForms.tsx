import React, { useState } from "react";

interface FieldSchema {
    name: string;
    type: string;
}

interface EntityFormProps {
    entityName: string;
    schema: FieldSchema[];
    initialData?: Record<string, any> | null;
    onSubmit: (data: Record<string, any>) => void;
    onClose: () => void;
}

export default function EntityForm({
                                       entityName,
                                       schema,
                                       initialData = null,
                                       onSubmit,
                                       onClose
                                   }: EntityFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>(
        initialData || {}
    );

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
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

    return (
        <div className="flex-1 p-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
                {initialData ? "Editar registro" : "Crear nuevo registro"} en{" "}
                <span className="text-blue-400">{entityName}</span>
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-[#202534] shadow-xl p-6 rounded-lg border border-gray-700"
            >
                {schema
                    // AJUSTE: Filtrar campos que no deben ser editados/mostrados en el formulario
                    ?.filter(field => !fieldsToExclude.includes(field.name) && field.name !== 'notes') // <-- Excluye 'notes' si sigue en el esquema
                    .map((field) => (
                        <div key={field.name} className="flex flex-col">
                            <label
                                className="font-medium text-gray-300 mb-1"
                            >
                                {/* AJUSTE: Capitalizar el nombre del campo para mejor visualización */}
                                {field.name.charAt(0).toUpperCase() + field.name.slice(1).replace('_', ' ')}
                            </label>

                            {field.type === "boolean" ? (
                                <select
                                    className="border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                                    value={formData[field.name] ?? ""}
                                    onChange={(e) => handleChange(field.name, e.target.value === "true")}
                                >
                                    <option value="">Seleccione…</option>
                                    <option value="true">Sí</option>
                                    <option value="false">No</option>
                                </select>
                            ) : (
                                <input
                                    type={field.type === "number" ? "number" : "text"}
                                    className="border rounded px-3 py-2 bg-gray-800 text-white border-gray-700"
                                    value={formData[field.name] ?? ""}
                                    onChange={(e) =>
                                        handleChange(
                                            field.name,
                                            field.type === "number" ? Number(e.target.value) : e.target.value
                                        )
                                    }
                                />
                            )}
                        </div>
                    ))}
                
                {initialData && initialData.createdAt && (
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-300 mb-1">
                            Fecha de Creación
                        </label>
                        <p className="px-3 py-2 text-gray-400 bg-gray-800 border border-gray-700 rounded">
                            {initialData.createdAt}
                        </p>
                    </div>
                )}

                <div className="flex justify-end pt-4 space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        {initialData ? "Guardar cambios" : "Crear registro"}
                    </button>
                </div>
            </form>
        </div>
    );
}