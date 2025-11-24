import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { studentService } from "@/api/studentService";
import ExportButtons from "./ExportButtons";
import InstanceInfoPanel from "../../student/components/InstanceInfoPanel";
const defaultSQL = `-- Escribe aquí tu consulta SQL (o consulta para el motor correspondiente)
SELECT 1 as saludo;`;
const QueryEditor = () => {
    const [searchParams] = useSearchParams();
    const instanceId = searchParams.get("instance") ?? undefined;
    const [code, setCode] = useState(defaultSQL);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [detectedEntity, setDetectedEntity] = useState(null);
    const handleRun = useCallback(async () => {
        setLoading(true);
        setError(null);
        setResult(null);
        setDetectedEntity(null);
        try {
            const res = await studentService.executeQuery(instanceId ?? "default", code);
            const data = (res && (res.data ?? res));
            if (data?.error) {
                setError(data.error);
                setResult(null);
            }
            else {
                setResult({
                    columns: data.columns ?? Object.keys(data?.rows?.[0] ?? {}).map(String),
                    rows: data.rows ?? [],
                    executionTimeMs: data.executionTimeMs ?? undefined,
                });
            }
            const match = code.match(/from\s+(\w+)/i);
            setDetectedEntity(match ? match[1] : null);
        }
        catch (err) {
            console.error("executeQuery error", err);
            setError(err?.response?.data?.error ?? err?.message ?? "Error ejecutando la consulta");
        }
        finally {
            setLoading(false);
        }
    }, [code, instanceId]);
    return (_jsxs("div", { className: "w-full", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold", children: "Query Editor" }), _jsxs("p", { className: "text-sm text-gray-400", children: ["Ejecuta consultas contra tu instancia", instanceId ? ` ${instanceId}` : "", "."] })] }), _jsxs("div", { className: "flex gap-2 items-center", children: [_jsx("button", { onClick: handleRun, className: "px-4 py-2 bg-blue-600 rounded text-white", disabled: loading, children: loading ? "Ejecutando..." : "Run" }), result?.columns && (_jsx(ExportButtons, { columns: result.columns, rows: result.rows ?? [], entityName: "query_result", advanced: false }))] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsx("div", { className: "min-h-80 bg-[#0b0c10] border border-gray-800 rounded", children: _jsx(Editor, { height: "360px", defaultLanguage: "sql", value: code, onChange: (v) => setCode(v ?? ""), theme: "vs-dark", options: {
                                minimap: { enabled: false },
                                fontSize: 13,
                            } }) }), _jsxs("div", { className: "bg-[#0b0c10] border border-gray-800 rounded p-3 min-h-80", children: [_jsxs("div", { className: "mb-2 flex items-center justify-between", children: [_jsxs("div", { className: "text-sm text-gray-400", children: ["Resultados ", result?.executionTimeMs ? `• ${result.executionTimeMs} ms` : ""] }), _jsx("div", { className: "text-xs text-gray-400", children: "Formato tabla" })] }), error && (_jsxs("div", { className: "text-red-400 text-sm mb-2", children: ["Error: ", error] })), !result && !error && (_jsx("div", { className: "text-gray-400 text-sm", children: "Ejecuta una consulta para ver resultados." })), result && result.columns && (_jsx("div", { className: "overflow-auto", children: _jsxs("table", { className: "min-w-full text-sm", children: [_jsx("thead", { children: _jsx("tr", { children: result.columns.map((col) => (_jsx("th", { className: "text-left px-2 py-1 text-xs text-gray-400", children: col }, col))) }) }), _jsx("tbody", { children: result.rows?.length ? (result.rows.map((row, i) => (_jsx("tr", { className: i % 2 === 0 ? "bg-transparent" : "bg-[#071018]", children: row.map((cell, j) => (_jsx("td", { className: "px-2 py-1 text-sm", children: typeof cell === "object"
                                                        ? JSON.stringify(cell)
                                                        : String(cell) }, j))) }, i)))) : (_jsx("tr", { children: _jsx("td", { colSpan: result.columns.length, className: "text-gray-400 px-2 py-2", children: "Sin filas" }) })) })] }) })), result && !result.columns && (_jsx("pre", { className: "text-xs text-gray-300 overflow-auto max-h-[260px]", children: JSON.stringify(result, null, 2) })), detectedEntity &&
                                result?.rows &&
                                result.rows.length > 0 && (_jsx(InstanceInfoPanel, { entity: detectedEntity, records: result.rows.map((r) => {
                                    const obj = {};
                                    result.columns?.forEach((c, i) => {
                                        obj[c] = r[i];
                                    });
                                    return obj;
                                }) }))] })] })] }));
};
export default QueryEditor;
