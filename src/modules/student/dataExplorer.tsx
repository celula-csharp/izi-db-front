import { useEffect, useState } from "react";
import EntityList from "./components/EntityList";
import ResultsTable from "./components/ResultsTable";
import EntityForm from "./components/EntityForm";

export default function DataExplorer() {
    const [entities, setEntities] = useState<string[]>([]);
    const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
    const [records, setRecords] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);

    // Cargar entidades del backend (simulado)
    useEffect(() => {
        // TODO → GET /student/entities
        setEntities(["users", "products", "orders", "sessions"]);
    }, []);

    // Cuando cambia la entidad seleccionada → cargar registros
    useEffect(() => {
        if (!selectedEntity) return;

        // TODO → GET /student/entities/{selectedEntity}
        setRecords([
            { id: 1, name: "Ejemplo 1", createdAt: "2025-01-01" },
            { id: 2, name: "Ejemplo 2", createdAt: "2025-01-03" },
        ]);
    }, [selectedEntity]);

    const handleCreate = (data: any) => {
        console.log("Crear registro en", selectedEntity, data);

        setShowForm(false);

        // TODO: POST → /student/entities/{entity}
        setRecords((prev) => [...prev, { id: prev.length + 1, ...data }]);
    };

    return (
        <div className="flex h-full gap-4">

            {/* SIDEBAR DE ENTIDADES */}
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

            {/* TABLA DE RESULTADOS */}
            <main className="flex-1 bg-[#151823] border border-gray-700 rounded-xl p-4 overflow-auto">
                <h2 className="text-lg font-semibold mb-4">
                    {selectedEntity ? `Entidad: ${selectedEntity}` : "Selecciona una entidad"}
                </h2>

                {selectedEntity ? (
                    <ResultsTable rows={records} />
                ) : (
                    <p className="text-gray-400">No hay entidad seleccionada.</p>
                )}
            </main>

            {/* MODAL FORM */}
            {showForm && (
                <EntityForm
                    entity={selectedEntity!}
                    onClose={() => setShowForm(false)}
                    onSubmit={handleCreate}
                />
            )}
        </div>
    );
}
