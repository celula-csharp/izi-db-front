import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ResultsTable = ({ data }) => {
    if (!data || data.length === 0)
        return _jsx("p", { className: "text-gray-400 text-sm", children: "No hay resultados para mostrar." });
    const columns = Object.keys(data[0] || {});
    return (_jsx("div", { className: "overflow-auto border border-gray-700 rounded-lg", children: _jsxs("table", { className: "w-full text-left text-sm text-gray-200", children: [_jsx("thead", { className: "bg-gray-800 text-gray-300", children: _jsx("tr", { children: columns.map((col) => (_jsx("th", { className: "px-4 py-2 border-b border-gray-700", children: col }, col))) }) }), _jsx("tbody", { children: data.map((row, idx) => (_jsx("tr", { className: "even:bg-gray-900 odd:bg-gray-800", children: columns.map((col) => (_jsx("td", { className: "px-4 py-2 border-b border-gray-700", children: String(row[col] ?? "") }, col))) }, idx))) })] }) }));
};
export default ResultsTable;
