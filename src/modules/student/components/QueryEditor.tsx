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
  Plus,
  Search,
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
  operation?: string;
};

type OperationType = "find" | "insert";

const defaultFindQuery = `// Ejemplos de consultas MongoDB - FILTROS FIND
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

const defaultInsertQuery = `// Ejemplos de documentos para INSERT
// Insertar un usuario básico
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "age": 30,
  "status": "active"
}

// Insertar un producto
{
  "name": "Laptop Gaming",
  "price": 999.99,
  "category": "electronics",
  "inStock": true,
  "tags": ["gaming", "laptop", "computers"]
}

// Insertar con campos anidados
{
  "user": {
    "firstName": "María",
    "lastName": "García",
    "address": {
      "street": "123 Main St",
      "city": "Madrid",
      "country": "Spain"
    }
  },
  "preferences": ["sports", "music", "travel"]
}`;

const QueryEditor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const instanceId = searchParams.get("instance") ?? undefined;
  const editorRef = useRef<any>(null);

  const [operation, setOperation] = useState<OperationType>("find");
  const [code, setCode] = useState<string>(defaultFindQuery);
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

  const validateQuery = (query: string, op: OperationType): boolean => {
    console.log(op);
    try {
      const cleanQuery = query
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .trim();

      if (cleanQuery === "") {
        setIsQueryValid(false);
        return false;
      }

      // Validar que sea JSON válido
      JSON.parse(cleanQuery);
      setIsQueryValid(true);
      return true;
    } catch {
      setIsQueryValid(false);
      return false;
    }
  };

  const handleOperationChange = (newOperation: OperationType) => {
    setOperation(newOperation);
    setCode(newOperation === "find" ? defaultFindQuery : defaultInsertQuery);
    setResult(null);
    setError(null);
    setRequestInfo(null);
    setShowRawData(false);
    validateQuery(
      newOperation === "find" ? defaultFindQuery : defaultInsertQuery,
      newOperation
    );
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

    if (!validateQuery(code, operation)) {
      setError("La consulta debe ser un objeto JSON válido");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setRequestInfo(null);

    try {
      const cleanCode = code
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .trim();

      const parsedQuery = JSON.parse(cleanCode);

      // Obtener información de la instancia para el connectionString
      const instanceRes = await studentService.getInstanceById(instanceId!);
      const instance = instanceRes.data;

      // Preparar información del request para mostrar
      const requestData = {
        connectionString: instance.connectionInfo?.connectionString || "***",
        databaseName: databaseSchema,
        collectionName: collectionName,
        ...(operation === "find"
          ? { query: JSON.stringify(parsedQuery) }
          : { document: parsedQuery }),
      };
      setRequestInfo(requestData);

      const startTime = performance.now();

      let res;
      if (operation === "find") {
        // Ejecutar consulta FIND
        res = await studentService.executeQuery(
          instanceId!,
          cleanCode, // Enviar el string JSON limpio directamente
          collectionName,
          databaseSchema
        );
      } else {
        // Ejecutar INSERT - usar el método insertDocument
        res = await studentService.insertDocument(
          instanceId!,
          collectionName,
          parsedQuery,
          databaseSchema
        );
      }

      const endTime = performance.now();
      const data = res.data;

      if (data?.error) {
        setError(data.error);
        setResult(null);
      } else {
        const executionTime =
          data.executionTimeMs ?? Math.round(endTime - startTime);

        if (operation === "find") {
          processFindResponseData(data, executionTime);
        } else {
          // Para INSERT, mostrar mensaje de éxito
          setResult({
            columns: ["operation", "status", "message"],
            rows: [["insert", "success", "Documento insertado correctamente"]],
            executionTimeMs: executionTime,
            rowCount: 1,
            rawData: data,
            operation: "insert",
          });
        }
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
            "Error ejecutando la operación"
        );
      }
    } finally {
      setLoading(false);
    }
  }, [code, instanceId, databaseSchema, collectionName, operation]);

  const processFindResponseData = (data: any, executionTime: number) => {
    let rows: any[] = [];
    let columns: string[] = [];
    const rawData = data;

    try {
      console.log("Backend response:", data); // Para debugging

      // El backend devuelve los documentos en data.documents
      if (data.documents && Array.isArray(data.documents)) {
        rows = data.documents;
        if (rows.length > 0) {
          // Obtener columnas del primer documento
          columns = Object.keys(rows[0]);
        }
      }
      // Si es un array directo
      else if (Array.isArray(data)) {
        rows = data;
        if (rows.length > 0) {
          columns = Object.keys(rows[0]);
        }
      }
      // Si tiene formato de resultado con count
      else if (data.count !== undefined) {
        rows = data.documents || [];
        if (rows.length > 0) {
          columns = Object.keys(rows[0]);
        }
      }
      // Si es un objeto simple (un solo documento)
      else if (typeof data === "object" && data !== null) {
        // Verificar si es un documento individual
        if (!data.error && !data.count) {
          rows = [data];
          columns = Object.keys(data);
        }
      }

      // Asegurarnos de que cada row sea un array para la tabla
      const tableRows = rows.map((row) => {
        if (Array.isArray(row)) {
          return row; // Ya es un array
        } else if (typeof row === "object" && row !== null) {
          // Convertir objeto a array de valores
          return columns.map((col) => row[col]);
        } else {
          // Si no es ni array ni objeto, devolver como array de un elemento
          return [row];
        }
      });

      setResult({
        columns: columns,
        rows: tableRows, // Usar los rows procesados para la tabla
        executionTimeMs: executionTime,
        rowCount: rows.length,
        rawData: rawData,
        operation: "find",
      });
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      setResult({
        columns: [],
        rows: [],
        executionTimeMs: executionTime,
        rowCount: 0,
        rawData: data,
        operation: "find",
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
    validateQuery(value ?? "", operation);
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
    setCode(operation === "find" ? defaultFindQuery : defaultInsertQuery);
    setResult(null);
    setError(null);
    setDetectedEntity(null);
    setShowRawData(false);
    setRequestInfo(null);
    setIsQueryValid(true);
  };

  const findExamples = {
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

  const insertExamples = {
    user: `{
  "name": "Nuevo Usuario",
  "email": "usuario@example.com",
  "age": 25,
  "status": "active"
}`,
    product: `{
  "name": "Nuevo Producto",
  "price": 49.99,
  "category": "electronics",
  "inStock": true
}`,
    nested: `{
  "user": {
    "firstName": "Ana",
    "lastName": "López"
  },
  "preferences": ["reading", "music"]
}`,
  };

  const insertExample = (example: string) => {
    setCode(example);
    validateQuery(example, operation);
  };

  const getOperationColor = (op: OperationType) => {
    return operation === op ? "bg-green-600" : "bg-gray-700 hover:bg-gray-600";
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
            Ejecuta consultas y operaciones en tu instancia
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

          {result?.columns &&
            result.rows &&
            result.rows.length > 0 &&
            result.operation === "find" && (
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
                {operation === "find" ? "Buscando..." : "Insertando..."}
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {operation === "find"
                  ? "Ejecutar (Ctrl+Enter)"
                  : "Insertar (Ctrl+Enter)"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Selector de Operación */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          Tipo de Operación
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => handleOperationChange("find")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${getOperationColor(
              "find"
            )} text-white`}
          >
            <Search className="w-4 h-4" />
            Buscar (FIND)
          </button>
          <button
            onClick={() => handleOperationChange("insert")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${getOperationColor(
              "insert"
            )} text-white`}
          >
            <Plus className="w-4 h-4" />
            Insertar (INSERT)
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
              ? `Consulta válida - ${
                  operation === "find"
                    ? "Filtro JSON correcto"
                    : "Documento JSON correcto"
                }`
              : `Consulta no válida - Debe ser un objeto JSON`}
          </span>
        </div>
      </div>

      {/* Ejemplos según la operación */}
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-3">
          {operation === "find"
            ? "Ejemplos de Filtros JSON"
            : "Ejemplos de Documentos para INSERT"}
        </h3>
        <div className="flex flex-wrap gap-2">
          {operation === "find" ? (
            <>
              <button
                onClick={() => insertExample(findExamples.basic)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
              >
                Básico
              </button>
              <button
                onClick={() => insertExample(findExamples.multiple)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
              >
                Múltiple
              </button>
              <button
                onClick={() => insertExample(findExamples.logical)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
              >
                Lógico
              </button>
              <button
                onClick={() => insertExample(findExamples.regex)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
              >
                Regex
              </button>
              <button
                onClick={() => insertExample(findExamples.empty)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
              >
                Todos
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => insertExample(insertExamples.user)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
              >
                Usuario
              </button>
              <button
                onClick={() => insertExample(insertExamples.product)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
              >
                Producto
              </button>
              <button
                onClick={() => insertExample(insertExamples.nested)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm transition-colors"
              >
                Anidado
              </button>
            </>
          )}
        </div>
      </div>

      {/* Información importante */}
      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Code className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-300 font-medium mb-1">
              {operation === "find"
                ? "Formato para FIND"
                : "Formato para INSERT"}
            </h4>
            <p className="text-blue-200 text-sm">
              {operation === "find"
                ? "El backend espera un filtro JSON para consultas find."
                : "El backend espera un documento JSON completo para insertar."}
            </p>
            <p className="text-blue-200 text-sm mt-1">
              {operation === "find" ? "Ejemplo: " : "Ejemplo: "}
              <code className="bg-blue-900/50 px-1">
                {operation === "find"
                  ? '{ "age": { "$gte": 18 } }'
                  : '{ "name": "Juan", "age": 30 }'}
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Mostrar request */}
      {requestInfo && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
            <Code className="w-4 h-4" />
            Request Enviado ({operation.toUpperCase()})
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
              {operation === "find"
                ? "Editor de Filtros JSON"
                : "Editor de Documentos JSON"}
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
              {operation === "find"
                ? "Resultados"
                : "Resultado de la Operación"}
            </h3>

            {result && (
              <div className="flex items-center gap-4 text-sm text-gray-400">
                {result.executionTimeMs && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {result.executionTimeMs}ms
                  </span>
                )}
                {result.rowCount !== undefined &&
                  result.rows &&
                  operation === "find" && (
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
                  <p>
                    {operation === "find"
                      ? "Ejecuta una consulta para ver los resultados"
                      : "Inserta un documento para ver el resultado"}
                  </p>
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
                              {operation === "find"
                                ? "No se encontraron documentos"
                                : "No hay resultados para mostrar"}
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

          {/* Instance Info Panel - Solo para FIND */}
          {operation === "find" &&
            detectedEntity &&
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
