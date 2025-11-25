/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { studentService } from "@/api/studentService";
import Editor from "@monaco-editor/react";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Code,
  Database,
  Play,
  Settings,
  Square,
} from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import InstanceInfoPanel from "../../student/components/InstanceInfoPanel";
import ExportButtons from "./ExportButtons";

type QueryResult = {
  columns?: string[];
  rows?: any[][];
  error?: string;
  executionTimeMs?: number;
  rowCount?: number;
  rawData?: any;
};

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

const QueryEditor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const instanceId = searchParams.get("instance") ?? undefined;
  const editorRef = useRef<any>(null);

  const [code, setCode] = useState<string>(defaultMongoDB);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [detectedEntity, setDetectedEntity] = useState<string | null>(null);
  const [databaseSchema, setDatabaseSchema] = useState<string>("test");
  const [showRawData, setShowRawData] = useState<boolean>(false);
  const [requestInfo, setRequestInfo] = useState<any>(null);
  const [isQueryValid, setIsQueryValid] = useState<boolean>(true);
  const [collectionName, setCollectionName] = useState<string>("users");

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const validateQuery = (query: string): boolean => {
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
    } catch {
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
      const res = await studentService.executeQuery(
        instanceId,
        code.trim(),
        collectionName,
        databaseSchema
      );

      const endTime = performance.now();
      const data = res.data;

      if (data?.error) {
        setError(data.error);
        setResult(null);
      } else {
        const executionTime =
          data.executionTimeMs ?? Math.round(endTime - startTime);
        processResponseData(data, executionTime);
      }
    } catch (err: any) {
      console.error("executeQuery error", err);

      if (err.response?.status === 400) {
        const errorData = err.response.data;
        if (errorData.errors) {
          const validationErrors = Object.entries(errorData.errors)
            .map(
              ([field, messages]) =>
                `${field}: ${(messages as string[]).join(", ")}`
            )
            .join("\n");
          setError(`Errores de validación:\n${validationErrors}`);
        } else {
          setError(errorData.title || "Error de validación en el servidor");
        }
      } else {
        setError(
          err?.response?.data?.error ??
            err?.response?.data?.message ??
            err?.message ??
            "Error ejecutando la consulta"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [code, instanceId, databaseSchema, collectionName]);

  const processResponseData = (data: any, executionTime: number) => {
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
    } catch (parseError) {
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

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      handleRun();
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    setCode(value ?? "");
    validateQuery(value ?? "");
  };

  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined) return "null";
    if (typeof value === "object") {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
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

  const insertExample = (example: string) => {
    setCode(example);
    validateQuery(example);
  };

  return (
    <div className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-green-400" />
            MongoDB Query Editor
          </h1>
          <p className="text-gray-400 mt-1">
            Ejecuta consultas MongoDB en tu instancia
            {instanceId ? ` #${instanceId}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Selector de Database */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Database:</label>
            <select
              value={databaseSchema}
              onChange={(e) => setDatabaseSchema(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
            >
              <option value="test">test</option>
              <option value="admin">admin</option>
              <option value="local">local</option>
            </select>
          </div>

          {/* Input de Collection Name */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-400">Collection:</label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="users"
              className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white w-32"
            />
          </div>

          <button
            onClick={clearEditor}
            className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            disabled={loading}
          >
            <Square className="w-4 h-4 inline mr-2" />
            Limpiar
          </button>

          {result && (
            <button
              onClick={() => setShowRawData(!showRawData)}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <Settings className="w-4 h-4 inline mr-2" />
              {showRawData ? "Vista Tabla" : "Vista Raw"}
            </button>
          )}

          {result?.columns && result.rows && result.rows.length > 0 && (
            <ExportButtons
              columns={result.columns}
              rows={result.rows}
              entityName={collectionName || "query_result"}
              advanced={false}
            />
          )}

          <button
            onClick={handleRun}
            disabled={
              loading ||
              !instanceId ||
              !code.trim() ||
              !isQueryValid ||
              !collectionName.trim()
            }
            className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Ejecutando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Ejecutar (Ctrl+Enter)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Estado de validación */}
      <div
        className={`p-4 rounded-lg border ${
          isQueryValid
            ? "bg-green-900/30 border-green-700 text-green-300"
            : "bg-yellow-900/30 border-yellow-700 text-yellow-300"
        }`}
      >
        <div className="flex items-center gap-2">
          {isQueryValid ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>
            {isQueryValid
              ? "Consulta válida - JSON correcto"
              : "Consulta no válida - Debe ser un objeto JSON"}
          </span>
        </div>
      </div>

      {/* Ejemplos de Filtros */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Ejemplos de Filtros JSON
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => insertExample(queryExamples.basic)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
          >
            Básico
          </button>
          <button
            onClick={() => insertExample(queryExamples.multiple)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
          >
            Múltiple
          </button>
          <button
            onClick={() => insertExample(queryExamples.logical)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
          >
            Lógico
          </button>
          <button
            onClick={() => insertExample(queryExamples.regex)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
          >
            Regex
          </button>
          <button
            onClick={() => insertExample(queryExamples.empty)}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
          >
            Todos
          </button>
        </div>
      </div>

      {/* Información importante */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Code className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-300 font-medium mb-1">
              Formato Requerido
            </h4>
            <p className="text-blue-200 text-sm">
              El backend espera un <strong>filtro JSON</strong> para consultas
              find. Ejemplo:{" "}
              <code className="bg-blue-900/50 px-1">
                {'{ "age": { "$gte": 18 } }'}
              </code>
            </p>
            <p className="text-blue-200 text-sm mt-1">
              No uses consultas MongoDB completas como{" "}
              <code className="bg-blue-900/50 px-1">db.users.find()</code>
            </p>
          </div>
        </div>
      </div>

      {/* Mostrar request */}
      {requestInfo && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Request Enviado
          </h4>
          <pre className="text-sm text-gray-300 bg-gray-750 p-3 rounded overflow-auto max-h-32">
            {JSON.stringify(requestInfo, null, 2)}
          </pre>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Square className="w-4 h-4 text-green-400" />
              Editor de Filtros JSON
            </h3>
            <div className="text-sm text-gray-400">
              {code.split("\n").length} líneas
            </div>
          </div>

          <div
            className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900 min-h-[400px]"
            onKeyDown={handleKeyDown}
          >
            <Editor
              height="400px"
              defaultLanguage="json"
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              onMount={handleEditorDidMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: "on",
                suggestOnTriggerCharacters: true,
                quickSuggestions: true,
              }}
            />
          </div>

          {!instanceId && (
            <div className="bg-yellow-900/50 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Selecciona una instancia MongoDB desde el dashboard para
                  ejecutar consultas
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-green-400" />
              Resultados
            </h3>

            {result && (
              <div className="flex items-center gap-4 text-sm text-gray-400">
                {result.executionTimeMs && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {result.executionTimeMs}ms
                  </span>
                )}
                {result.rowCount !== undefined && result.rows && (
                  <span>
                    {result.rowCount} documento
                    {result.rowCount !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 min-h-[400px] max-h-[600px] flex flex-col">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            {!result && !error && (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Ejecuta una consulta para ver los resultados</p>
                  <p className="text-sm mt-1">
                    Usa Ctrl+Enter para ejecutar rápidamente
                  </p>
                </div>
              </div>
            )}

            {result && showRawData && (
              <div className="flex-1 overflow-auto">
                <pre className="text-sm text-gray-300 bg-gray-750 p-4 rounded-lg whitespace-pre-wrap">
                  {JSON.stringify(result.rawData || result, null, 2)}
                </pre>
              </div>
            )}

            {result &&
              !showRawData &&
              result.columns &&
              result.columns.length > 0 && (
                <div className="flex-1 overflow-auto">
                  <div className="border border-gray-700 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-750 sticky top-0">
                        <tr>
                          {result.columns.map((col, index) => (
                            <th
                              key={index}
                              className="px-4 py-3 text-left text-xs font-medium text-gray-300 border-b border-gray-700"
                            >
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {result.rows && result.rows.length > 0 ? (
                          result.rows.map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className="hover:bg-gray-750/50 transition-colors"
                            >
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-4 py-2 text-gray-300 max-w-[200px] truncate"
                                  title={formatCellValue(cell)}
                                >
                                  {formatCellValue(cell)}
                                </td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={result.columns.length}
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No se encontraron documentos
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {result &&
              !showRawData &&
              (!result.columns || result.columns.length === 0) && (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Los resultados no se pueden mostrar en formato tabla</p>
                    <p className="text-sm mt-1">
                      Usa "Vista Raw" para ver los datos completos
                    </p>
                  </div>
                </div>
              )}
          </div>

          {/* Instance Info Panel */}
          {detectedEntity &&
            result?.rows &&
            result.rows.length > 0 &&
            !showRawData && (
              <InstanceInfoPanel
                entity={detectedEntity}
                records={result.rows.map((r) => {
                  const obj: any = {};
                  result.columns?.forEach((c, i) => {
                    obj[c] = r[i];
                  });
                  return obj;
                })}
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default QueryEditor;
