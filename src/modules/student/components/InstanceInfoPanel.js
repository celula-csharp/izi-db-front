import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function InstanceInfoPanel({ entity, records }) {
    if (!entity || !records.length)
        return null;
    const total = records.length;
    const columns = Object.keys(records[0]);
    const dates = records
        .map((r) => new Date(r.createdAt))
        .filter((d) => !isNaN(d.getTime()));
    const firstDate = dates.length ? dates[0].toISOString().split("T")[0] : "—";
    const lastDate = dates.length ? dates[dates.length - 1].toISOString().split("T")[0] : "—";
    return (_jsxs("div", { className: "mt-5 bg-[#0d0f16] border border-gray-700 rounded-xl p-4", children: [_jsx("h3", { className: "text-md font-semibold mb-3", children: "Informaci\u00F3n de la entidad" }), _jsxs("div", { className: "grid grid-cols-2 gap-4 text-sm text-gray-300", children: [_jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-xs", children: "Nombre" }), _jsx("p", { className: "font-medium", children: entity })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-xs", children: "Total de registros" }), _jsx("p", { className: "font-medium", children: total })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-xs", children: "Columnas" }), _jsx("p", { className: "font-medium", children: columns.join(", ") })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-xs", children: "Fecha m\u00EDnima" }), _jsx("p", { className: "font-medium", children: firstDate })] }), _jsxs("div", { children: [_jsx("p", { className: "text-gray-400 text-xs", children: "Fecha m\u00E1xima" }), _jsx("p", { className: "font-medium", children: lastDate })] })] })] }));
}
