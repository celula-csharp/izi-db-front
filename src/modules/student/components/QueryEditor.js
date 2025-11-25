import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { studentService } from "@/api/studentService";
import Editor from "@monaco-editor/react";
import { AlertCircle, CheckCircle, Clock, Code, Database, Play, Settings, Square, } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import InstanceInfoPanel from "../../student/components/InstanceInfoPanel";
import ExportButtons from "./ExportButtons";
const defaultMongoDB = `// Ejemplos de consultas MongoDB - SOLO FILTROS
// Consulta find con filtro básico
{ "age": { "$gte": 18 } }

// Consulta con múltiples condiciones
{
  "status": "active",
  "age": { "$gte": 18, "$lte": 65 },
  "city": { "$in": ["New York", "London", "Tokyo"] }
}

// Consulta con operador lógico
{
  "$or": [
    { "status": "active" },
    { "premium": true }
  ]
}

// Consulta con regex
{ "name": { "$regex": "john", "$options": "i" } }`;
const QueryEditor = () => {
    const [searchParams] = useSearchParams();
    const instanceId = searchParams.get("instance") ?? undefined;
    const editorRef = useRef(null);
    const [code, setCode] = useState(defaultMongoDB);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [detectedEntity, setDetectedEntity] = useState(null);
    const [databaseSchema, setDatabaseSchema] = useState("test");
    const [showRawData, setShowRawData] = useState(false);
    const [requestInfo, setRequestInfo] = useState(null);
    const [isQueryValid, setIsQueryValid] = useState(true);
    const [collectionName, setCollectionName] = useState("users");
    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };
    const validateQuery = (query) => {
        try {
            // Validar que sea JSON válido
            const cleanQuery = query
                .replace(/\/\/.*$/gm, "")
                .replace(/\/\*[\s\S]*?\*\//g, "")
                .trim();
            if (cleanQuery === "") {
                setIsQueryValid(false);
                return false;
            }
            // Intentar parsear como JSON
            JSON.parse(cleanQuery);
            setIsQueryValid(true);
            return true;
        }
        catch {
            setIsQueryValid(false);
            return false;
        }
    };
    const handleRun = useCallback(async () => {
        if (!code.trim()) {
            setError("La consulta no puede estar vacía");
            return;
        }
        if (!instanceId) {
            setError("Selecciona una instancia para ejecutar la consulta");
            return;
        }
        if (!collectionName.trim()) {
            setError("Debes especificar un nombre de colección");
            return;
        }
        if (!validateQuery(code)) {
            setError("La consulta debe ser un objeto JSON válido");
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);
        try {
            // Preparar información del request para mostrar
            const requestData = {
                connectionString: "***", // Se obtiene del servicio
                databaseName: databaseSchema,
                collectionName: collectionName,
                query: studentService.sanitizeMongoQuery(code),
            };
            setRequestInfo(requestData);
            const startTime = performance.now();
            // Usar el servicio actualizado
            const res = await studentService.executeQuery(instanceId, code.trim(), collectionName, databaseSchema);
            const endTime = performance.now();
            const data = res.data;
            if (data?.error) {
                setError(data.error);
                setResult(null);
            }
            else {
                const executionTime = data.executionTimeMs ?? Math.round(endTime - startTime);
                processResponseData(data, executionTime);
            }
        }
        catch (err) {
            console.error("executeQuery error", err);
            if (err.response?.status === 400) {
                const errorData = err.response.data;
                if (errorData.errors) {
                    const validationErrors = Object.entries(errorData.errors)
                        .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                        .join("\n");
                    setError(`Errores de validación:\n${validationErrors}`);
                }
                else {
                    setError(errorData.title || "Error de validación en el servidor");
                }
            }
            else {
                setError(err?.response?.data?.error ??
                    err?.response?.data?.message ??
                    err?.message ??
                    "Error ejecutando la consulta");
            }
        }
        finally {
            setLoading(false);
        }
    }, [code, instanceId, databaseSchema, collectionName]);
    const processResponseData = (data, executionTime) => {
        let rows = [];
        let columns = [];
        const rawData = data;
        try {
            // El backend devuelve los documentos en data.documents
            if (data.documents && Array.isArray(data.documents)) {
                rows = data.documents;
                if (rows.length > 0) {
                    // Obtener columnas del primer documento
                    columns = Object.keys(rows[0]);
                }
            }
            // O si devuelve directamente un array
            else if (Array.isArray(data)) {
                rows = data;
                if (rows.length > 0) {
                    columns = Object.keys(rows[0]);
                }
            }
            // O si tiene formato de resultado con count
            else if (data.count !== undefined) {
                rows = data.documents || [];
                if (rows.length > 0) {
                    columns = Object.keys(rows[0]);
                }
            }
            setResult({
                columns: columns,
                rows: rows,
                executionTimeMs: executionTime,
                rowCount: rows.length,
                rawData: rawData,
            });
        }
        catch (parseError) {
            console.error("Error parsing response:", parseError);
            setResult({
                columns: [],
                rows: [],
                executionTimeMs: executionTime,
                rowCount: 0,
                rawData: data,
            });
            setShowRawData(true);
        }
    };
    const handleKeyDown = (event) => {
        if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
            event.preventDefault();
            handleRun();
        }
    };
    const handleCodeChange = (value) => {
        setCode(value ?? "");
        validateQuery(value ?? "");
    };
    const formatCellValue = (value) => {
        if (value === null || value === undefined)
            return "null";
        if (typeof value === "object") {
            try {
                return JSON.stringify(value, null, 2);
            }
            catch {
                return "[Object]";
            }
        }
        return String(value);
    };
    const clearEditor = () => {
        setCode("");
        setResult(null);
        setError(null);
        setDetectedEntity(null);
        setShowRawData(false);
        setRequestInfo(null);
        setIsQueryValid(true);
    };
    const queryExamples = {
        basic: `{ "age": { "$gte": 18 } }`,
        multiple: `{
  "status": "active",
  "age": { "$gte": 18, "$lte": 65 }
}`,
        logical: `{
  "$or": [
    { "status": "active" },
    { "premium": true }
  ]
}`,
        regex: `{ "name": { "$regex": "john", "$options": "i" } }`,
        empty: `{}`,
    };
    const insertExample = (example) => {
        setCode(example);
        validateQuery(example);
    };
    return (_jsxs("div", { className: "w-full p-6 space-y-6", children: [_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [_jsx(Database, { className: "w-6 h-6 text-green-400" }), "MongoDB Query Editor"] }), _jsxs("p", { className: "text-gray-400 mt-1", children: ["Ejecuta consultas MongoDB en tu instancia", instanceId ? ` #${instanceId}` : ""] })] }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm text-gray-400", children: "Database:" }), _jsxs("select", { value: databaseSchema, onChange: (e) => setDatabaseSchema(e.target.value), className: "bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white", children: [_jsx("option", { value: "test", children: "test" }), _jsx("option", { value: "admin", children: "admin" }), _jsx("option", { value: "local", children: "local" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm text-gray-400", children: "Collection:" }), _jsx("input", { type: "text", value: collectionName, onChange: (e) => setCollectionName(e.target.value), placeholder: "users", className: "bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white w-32" })] }), _jsxs("button", { onClick: clearEditor, className: "px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200", disabled: loading, children: [_jsx(Square, { className: "w-4 h-4 inline mr-2" }), "Limpiar"] }), result && (_jsxs("button", { onClick: () => setShowRawData(!showRawData), className: "px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200", children: [_jsx(Settings, { className: "w-4 h-4 inline mr-2" }), showRawData ? "Vista Tabla" : "Vista Raw"] })), result?.columns && result.rows && result.rows.length > 0 && (_jsx(ExportButtons, { columns: result.columns, rows: result.rows, entityName: collectionName || "query_result", advanced: false })), _jsx("button", { onClick: handleRun, disabled: loading ||
                                    !instanceId ||
                                    !code.trim() ||
                                    !isQueryValid ||
                                    !collectionName.trim(), className: "px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-2", children: loading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Ejecutando..."] })) : (_jsxs(_Fragment, { children: [_jsx(Play, { className: "w-4 h-4" }), "Ejecutar (Ctrl+Enter)"] })) })] })] }), _jsx("div", { className: `p-4 rounded-lg border ${isQueryValid
                    ? "bg-green-900/30 border-green-700 text-green-300"
                    : "bg-yellow-900/30 border-yellow-700 text-yellow-300"}`, children: _jsxs("div", { className: "flex items-center gap-2", children: [isQueryValid ? (_jsx(CheckCircle, { className: "w-5 h-5" })) : (_jsx(AlertCircle, { className: "w-5 h-5" })), _jsx("span", { children: isQueryValid
                                ? "Consulta válida - JSON correcto"
                                : "Consulta no válida - Debe ser un objeto JSON" })] }) }), _jsxs("div", { className: "bg-gray-800 rounded-lg p-4 border border-gray-700", children: [_jsx("h3", { className: "text-sm font-medium text-gray-300 mb-3", children: "Ejemplos de Filtros JSON" }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("button", { onClick: () => insertExample(queryExamples.basic), className: "px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors", children: "B\u00E1sico" }), _jsx("button", { onClick: () => insertExample(queryExamples.multiple), className: "px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors", children: "M\u00FAltiple" }), _jsx("button", { onClick: () => insertExample(queryExamples.logical), className: "px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors", children: "L\u00F3gico" }), _jsx("button", { onClick: () => insertExample(queryExamples.regex), className: "px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors", children: "Regex" }), _jsx("button", { onClick: () => insertExample(queryExamples.empty), className: "px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors", children: "Todos" })] })] }), _jsx("div", { className: "bg-blue-900/30 border border-blue-700 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Code, { className: "w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("h4", { className: "text-blue-300 font-medium mb-1", children: "Formato Requerido" }), _jsxs("p", { className: "text-blue-200 text-sm", children: ["El backend espera un ", _jsx("strong", { children: "filtro JSON" }), " para consultas find. Ejemplo:", " ", _jsx("code", { className: "bg-blue-900/50 px-1", children: '{ "age": { "$gte": 18 } }' })] }), _jsxs("p", { className: "text-blue-200 text-sm mt-1", children: ["No uses consultas MongoDB completas como", " ", _jsx("code", { className: "bg-blue-900/50 px-1", children: "db.users.find()" })] })] })] }) }), requestInfo && (_jsxs("div", { className: "bg-gray-800 border border-gray-700 rounded-lg p-4", children: [_jsxs("h4", { className: "text-sm font-medium text-gray-300 mb-2 flex items-center gap-2", children: [_jsx(Code, { className: "w-4 h-4" }), "Request Enviado"] }), _jsx("pre", { className: "text-sm text-gray-300 bg-gray-750 p-3 rounded overflow-auto max-h-32", children: JSON.stringify(requestInfo, null, 2) })] })), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [_jsx(Square, { className: "w-4 h-4 text-green-400" }), "Editor de Filtros JSON"] }), _jsxs("div", { className: "text-sm text-gray-400", children: [code.split("\n").length, " l\u00EDneas"] })] }), _jsx("div", { className: "border border-gray-700 rounded-lg overflow-hidden bg-gray-900 min-h-[400px]", onKeyDown: handleKeyDown, children: _jsx(Editor, { height: "400px", defaultLanguage: "json", value: code, onChange: handleCodeChange, theme: "vs-dark", onMount: handleEditorDidMount, options: {
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        lineNumbers: "on",
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        tabSize: 2,
                                        wordWrap: "on",
                                        suggestOnTriggerCharacters: true,
                                        quickSuggestions: true,
                                    } }) }), !instanceId && (_jsx("div", { className: "bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4" }), _jsx("span", { children: "Selecciona una instancia MongoDB desde el dashboard para ejecutar consultas" })] }) }))] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [_jsx(Play, { className: "w-4 h-4 text-green-400" }), "Resultados"] }), result && (_jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-400", children: [result.executionTimeMs && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-4 h-4" }), result.executionTimeMs, "ms"] })), result.rowCount !== undefined && result.rows && (_jsxs("span", { children: [result.rowCount, " documento", result.rowCount !== 1 ? "s" : ""] }))] }))] }), _jsxs("div", { className: "bg-gray-800 border border-gray-700 rounded-lg p-4 min-h-[400px] max-h-[600px] flex flex-col", children: [error && (_jsx("div", { className: "bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertCircle, { className: "w-4 h-4 flex-shrink-0" }), _jsx("span", { children: error })] }) })), !result && !error && (_jsx("div", { className: "flex-1 flex items-center justify-center text-gray-500", children: _jsxs("div", { className: "text-center", children: [_jsx(Play, { className: "w-12 h-12 mx-auto mb-3 opacity-50" }), _jsx("p", { children: "Ejecuta una consulta para ver los resultados" }), _jsx("p", { className: "text-sm mt-1", children: "Usa Ctrl+Enter para ejecutar r\u00E1pidamente" })] }) })), result && showRawData && (_jsx("div", { className: "flex-1 overflow-auto", children: _jsx("pre", { className: "text-sm text-gray-300 bg-gray-750 p-4 rounded-lg whitespace-pre-wrap", children: JSON.stringify(result.rawData || result, null, 2) }) })), result &&
                                        !showRawData &&
                                        result.columns &&
                                        result.columns.length > 0 && (_jsx("div", { className: "flex-1 overflow-auto", children: _jsx("div", { className: "border border-gray-700 rounded-lg overflow-hidden", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-750 sticky top-0", children: _jsx("tr", { children: result.columns.map((col, index) => (_jsx("th", { className: "px-4 py-3 text-left text-xs font-medium text-gray-300 border-b border-gray-700", children: col }, index))) }) }), _jsx("tbody", { className: "divide-y divide-gray-700", children: result.rows && result.rows.length > 0 ? (result.rows.map((row, rowIndex) => (_jsx("tr", { className: "hover:bg-gray-750/50 transition-colors", children: row.map((cell, cellIndex) => (_jsx("td", { className: "px-4 py-2 text-gray-300 max-w-[200px] truncate", title: formatCellValue(cell), children: formatCellValue(cell) }, cellIndex))) }, rowIndex)))) : (_jsx("tr", { children: _jsx("td", { colSpan: result.columns.length, className: "px-4 py-8 text-center text-gray-500", children: "No se encontraron documentos" }) })) })] }) }) })), result &&
                                        !showRawData &&
                                        (!result.columns || result.columns.length === 0) && (_jsx("div", { className: "flex-1 flex items-center justify-center text-gray-500", children: _jsxs("div", { className: "text-center", children: [_jsx(Settings, { className: "w-12 h-12 mx-auto mb-3 opacity-50" }), _jsx("p", { children: "Los resultados no se pueden mostrar en formato tabla" }), _jsx("p", { className: "text-sm mt-1", children: "Usa \"Vista Raw\" para ver los datos completos" })] }) }))] }), detectedEntity &&
                                result?.rows &&
                                result.rows.length > 0 &&
                                !showRawData && (_jsx(InstanceInfoPanel, { entity: detectedEntity, records: result.rows.map((r) => {
                                    const obj = {};
                                    result.columns?.forEach((c, i) => {
                                        obj[c] = r[i];
                                    });
                                    return obj;
                                }) }))] })] })] }));
};
export default QueryEditor;
