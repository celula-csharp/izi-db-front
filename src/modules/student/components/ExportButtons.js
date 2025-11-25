import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useExportData } from "../hooks/useExportData";
export default function ExportButtons({ columns, rows, entityName, advanced = false, schema = [] }) {
    const { exportCSV, exportJSON, exportXLSX } = useExportData();
    if (!columns || columns.length === 0)
        return null;
    const fileName = entityName || "export";
    return (_jsxs("div", { className: "flex gap-2 items-center", children: [_jsx("button", { onClick: () => exportCSV(columns, rows, fileName), className: "px-3 py-1 text-sm rounded bg-green-600 hover:bg-green-700 text-white", children: "Export CSV" }), _jsx("button", { onClick: () => exportJSON(columns, rows, fileName), className: "px-3 py-1 text-sm rounded bg-yellow-600 hover:bg-yellow-700 text-white", children: "Export JSON" }), advanced && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => exportXLSX(columns, rows, fileName), className: "px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white", children: "Export XLSX" }), _jsx("button", { onClick: () => navigator.clipboard.writeText(JSON.stringify(rows, null, 2)), className: "px-3 py-3.5 text-sm rounded bg-purple-600 hover:bg-purple-700 text-white", children: "Copiar" }), schema.length > 0 && (_jsx("button", { onClick: () => exportJSON(["name", "type"], schema.map((s) => [s.name, s.type]), `${fileName}_schema`), className: "px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white", children: "Export Schema" }))] }))] }));
}
