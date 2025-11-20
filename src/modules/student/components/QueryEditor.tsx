import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { studentService } from "../../../api/studentService";

type QueryResult = {
    columns?: string[];
    rows?: any[][];
    error?: string;
    executionTimeMs?: number;
};

const defaultSQL = `-- Escribe aquí tu consulta SQL (o consulta para el motor correspondiente)
SELECT 1 as saludo;`;

const QueryEditor: React.FC = () => {
    const [searchParams] = useSearchParams();
    const instanceId = searchParams.get("instance") ?? undefined;

    const [code, setCode] = useState<string>(defaultSQL);
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<QueryResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // si viniste con query guardada en URL (opcional), podríamos cargarla aquí
    }, []);

    const handleRun = useCallback(async () => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            if (!instanceId) {
                // si no hay instancia explícita, asumimos que backend sabrá a cuál aplicar o devolverá error
                // aún así, el service espera instanceId; si tu backend acepta sin id, adapta studentService.
            }

            // studentService.executeQuery(instanceId, code)
            const res = await studentService.executeQuery(instanceId ?? "default", code);
            const data = (res && (res.data ?? res)) as any;

            // data expected shape: { columns: [], rows: [[...],[...]] } or { error: '...' }
            if (data?.error) {
                setError(data.error);
                setResult(null);
            } else {
                setResult({
                    columns: data.columns ?? Object.keys(data?.rows?.[0] ?? {}).map(String),
                    rows: data.rows ?? [],
                    executionTimeMs: data.executionTimeMs ?? undefined,
                });
            }
        } catch (err: any) {
            console.error("executeQuery error", err);
            setError(err?.response?.data?.error ?? err?.message ?? "Error ejecutando la consulta");
        } finally {
            setLoading(false);
        }
    }, [code, instanceId]);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Query Editor</h2>
                    <p className="text-sm text-gray-400">Ejecuta consultas contra tu instancia{instanceId ? ` ${instanceId}` : ""}.</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleRun}
                        className="px-4 py-2 bg-blue-600 rounded text-white"
                        disabled={loading}
                    >
                        {loading ? "Ejecutando..." : "Run"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="min-h-[320px] bg-[#0b0c10] border border-gray-800 rounded">
                    <Editor
                        height="360px"
                        defaultLanguage="sql"
                        value={code}
                        onChange={(v) => setCode(v ?? "")}
                        theme="vs-dark"
                        options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                        }}
                    />
                </div>

                <div className="bg-[#0b0c10] border border-gray-800 rounded p-3 min-h-[320px]">
                    <div className="mb-2 flex items-center justify-between">
                        <div className="text-sm text-gray-400">
                            Resultados {result?.executionTimeMs ? `• ${result.executionTimeMs} ms` : ""}
                        </div>
                        <div className="text-xs text-gray-400">Formato tabla</div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-sm mb-2">
                            Error: {error}
                        </div>
                    )}

                    {!result && !error && (
                        <div className="text-gray-400 text-sm">Ejecuta una consulta para ver resultados.</div>
                    )}

                    {result && result.columns && (
                        <div className="overflow-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                <tr>
                                    {result.columns.map((col) => (
                                        <th key={col} className="text-left px-2 py-1 text-xs text-gray-400">{col}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {result.rows && result.rows.length > 0 ? (
                                    result.rows.map((row, i) => (
                                        <tr key={i} className={i % 2 === 0 ? "bg-transparent" : "bg-[#071018]"}>
                                            {row.map((cell: any, j: number) => (
                                                <td key={j} className="px-2 py-1 text-sm">
                                                    {typeof cell === "object" ? JSON.stringify(cell) : String(cell)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={result.columns.length} className="text-gray-400 px-2 py-2">
                                            Sin filas
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Fallback: show raw JSON */}
                    {result && !result.columns && (
                        <pre className="text-xs text-gray-300 overflow-auto max-h-[260px]">
              {JSON.stringify(result, null, 2)}
            </pre>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QueryEditor;
