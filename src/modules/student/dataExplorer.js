import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
    const [entities, setEntities] = useState([]);
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [records, setRecords] = useState([]);
    const [showForm, setShowForm] = useState(false);
    // Mock: cargar lista de entidades
    useEffect(() => {
        setEntities(["users", "products", "orders", "sessions"]);
    }, []);
    // Mock: cargar dataset de la entidad
    useEffect(() => {
        if (!selectedEntity)
            return;
        setRecords([
            { id: 1, name: "Ejemplo 1", createdAt: "2025-01-01" },
            { id: 2, name: "Ejemplo 2", createdAt: "2025-01-03" },
        ]);
    }, [selectedEntity]);
    // Crear registros
    const handleCreate = (data) => {
        setShowForm(false);
        setRecords((prev) => [...prev, { id: prev.length + 1, ...data }]);
    };
    // Columnas dinámicas
    const columns = useMemo(() => {
        if (!records.length)
            return [];
        return Object.keys(records[0]);
    }, [records]);
    // Filas para tabla → formato matriz
    const rows = useMemo(() => {
        return records.map((rec) => columns.map((col) => rec[col]));
    }, [records, columns]);
    return (_jsxs("div", { className: "flex h-full gap-4", children: [_jsxs("aside", { className: "w-64 bg-[#151823] border border-gray-700 rounded-xl p-4", children: [_jsx("h2", { className: "text-lg font-semibold mb-3", children: "Entidades" }), _jsx(EntityList, { entities: entities, selected: selectedEntity, onSelect: setSelectedEntity }), _jsx("button", { onClick: () => setShowForm(true), className: "mt-4 w-full bg-blue-600 hover:bg-blue-500 rounded-lg py-2 text-sm font-semibold", disabled: !selectedEntity, children: "+ Nuevo registro" })] }), _jsxs("main", { className: "flex-1 bg-[#151823] border border-gray-700 rounded-xl p-4 overflow-auto", children: [_jsx("h2", { className: "text-lg font-semibold mb-4", children: selectedEntity ? `Entidad: ${selectedEntity}` : "Selecciona una entidad" }), selectedEntity && columns.length > 0 && (_jsx("div", { className: "mb-4", children: _jsx(ExportButtons, { columns: columns, rows: rows, advanced: true, schema: MOCK_ENTITY_SCHEMA, entityName: selectedEntity }) })), selectedEntity ? (_jsxs(_Fragment, { children: [_jsx(ResultsTable, { data: records }), _jsx(InstanceInfoPanel, { entity: selectedEntity, records: records })] })) : (_jsx("p", { className: "text-gray-400", children: "No hay entidad seleccionada." }))] }), showForm && (_jsx(EntityForm, { entityName: selectedEntity, schema: MOCK_ENTITY_SCHEMA, onClose: () => setShowForm(false), onSubmit: handleCreate }))] }));
}
