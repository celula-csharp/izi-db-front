import { useEffect, useMemo, useState } from "react";
import EntityList from "./components/EntityList";
import ResultsTable from "./components/ResultsTable";
import EntityForm from "./components/EntityForms";
import ExportButtons from "./components/ExportButtons";
import InstanceInfoPanel from "./components/InstanceInfoPanel";

const MOCK_ENTITY_SCHEMA = [
    { name: "id", type: "number" },
    { name: "name", type: "string" },
    { name: "is_active", type: "boolean" },
    { name: "notes", type: "text" },
];

export default function DataExplorer() {
    const [entities, setEntities] = useState<string[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
    const [records, setRecords] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Mock: cargar lista de entidades
    useEffect(() => {
        setEntities(["users", "products", "orders", "sessions"]);
    }, []);

    // Mock: cargar dataset de la entidad
    useEffect(() => {
        if (!selectedEntity) return;

        setRecords([
            { id: 1, name: "Ejemplo 1", createdAt: "2025-01-01" },
            { id: 2, name: "Ejemplo 2", createdAt: "2025-01-03" },
        ]);
    }, [selectedEntity]);

    // Crear registros
    const handleCreate = (data: any) => {
        setShowForm(false);
        setRecords((prev) => [...prev, { id: prev.length + 1, ...data }]);
    };

    // Columnas dinámicas
    const columns = useMemo(() => {
        if (!records.length) return [];
        return Object.keys(records[0]);
    }, [records]);

    // Filas para tabla → formato matriz
    const rows = useMemo(() => {
        return records.map((rec) => columns.map((col) => rec[col]));
    }, [records, columns]);

    return (
        <div className="flex h-full gap-4">

            {/* SIDEBAR */}
            <aside className="w-64 bg-[#151823] border border-gray-700 rounded-xl p-4">
                <h2 className="text-lg font-semibold mb-3">Entidades</h2>

                <EntityList
                    entities={entities}
                    selected={selectedEntity}
                    onSelect={setSelectedEntity}
                />

                <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-500 rounded-lg py-2 text-sm font-semibold"
                    disabled={!selectedEntity}
                >
                    + Nuevo registro
                </button>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 bg-[#151823] border border-gray-700 rounded-xl p-4 overflow-auto">

                <h2 className="text-lg font-semibold mb-4">
                    {selectedEntity ? `Entidad: ${selectedEntity}` : "Selecciona una entidad"}
                </h2>

                {/* EXPORTAR */}
                {selectedEntity && columns.length > 0 && (
                    <div className="mb-4">
                        <ExportButtons
                            columns={columns}
                            rows={rows}
                            advanced={true}
                            schema={MOCK_ENTITY_SCHEMA}
                            entityName={selectedEntity}
                        />
                    </div>
                )}

                {/* TABLA */}
                {selectedEntity ? (
                    <>
                        <ResultsTable data={records} />

                        {/* INFO PANEL */}
                        <InstanceInfoPanel
                            entity={selectedEntity}
                            records={records}
                        />
                    </>
                ) : (
                    <p className="text-gray-400">No hay entidad seleccionada.</p>
                )}
            </main>

            {/* FORMULARIO */}
            {showForm && (
                <EntityForm
                    entityName={selectedEntity!}
                    schema={MOCK_ENTITY_SCHEMA}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleCreate}
                />
            )}
        </div>
    );
}
