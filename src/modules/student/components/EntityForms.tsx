import React, { useState } from "react";

interface FieldSchema {
    name: string;
    type: string; // "string" | "number" | "boolean" | ...
}

interface EntityFormProps {
    entityName: string;
    schema: FieldSchema[];
    initialData?: Record<string, any> | null;
    onSubmit: (data: Record<string, any>) => void;
}

export default function EntityForm({
                                       entityName,
                                       schema,
                                       initialData = null,
                                       onSubmit
                                   }: EntityFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>(
        initialData || {}
    );

    const handleChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="flex-1 p-6">
            <h2 className="text-xl font-semibold mb-4">
                {initialData ? "Editar registro" : "Crear nuevo registro"} en{" "}
                <span className="text-blue-600">{entityName}</span>
            </h2>

            <form
                onSubmit={handleSubmit}
                className="space-y-4 bg-white shadow-md p-6 rounded-lg border border-gray-200"
            >
                {schema.map((field) => (
                    <div key={field.name} className="flex flex-col">
                        <label className="font-medium text-gray-700 mb-1">
                            {field.name}
                        </label>

                        {field.type === "boolean" ? (
                            <select
                                className="border rounded px-3 py-2"
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
                                className="border rounded px-3 py-2"
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

                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    {initialData ? "Guardar cambios" : "Crear registro"}
                </button>
            </form>
        </div>
    );
}
