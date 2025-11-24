import { useExportData } from "../hooks/useExportData";

export interface ExportButtonsProps {
    columns: string[];
    rows: any[][];
    entityName?: string;
    advanced?: boolean;
    schema?: { name: string; type: string }[];
}

export default function ExportButtons({
                                          columns,
                                          rows,
                                          entityName,
                                          advanced = false,
                                          schema = []
                                      }: ExportButtonsProps) {
    const { exportCSV, exportJSON, exportXLSX } = useExportData();

    if (!columns || columns.length === 0) return null;

    const fileName = entityName || "export";

    return (
        <div className="flex gap-2 items-center">
            <button
                onClick={() => exportCSV(columns, rows, fileName)}
                className="px-3 py-1 text-sm rounded bg-green-600 hover:bg-green-700 text-white"
            >
                Export CSV
            </button>
            
            <button
                onClick={() => exportJSON(columns, rows, fileName)}
                className="px-3 py-1 text-sm rounded bg-yellow-600 hover:bg-yellow-700 text-white"
            >
                Export JSON
            </button>
            
            {advanced && (
                <>
                    {/* XLSX */}
                    <button
                        onClick={() => exportXLSX(columns, rows, fileName)}
                        className="px-3 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Export XLSX
                    </button>
                    
                    <button
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(rows, null, 2))}
                        className="px-3 py-3.5 text-sm rounded bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        Copiar 
                        
                    </button>
                    
                    {schema.length > 0 && (
                        <button
                            onClick={() =>
                                exportJSON(
                                    ["name", "type"],
                                    schema.map((s) => [s.name, s.type]),
                                    `${fileName}_schema`
                                )
                            }
                            className="px-3 py-1 text-sm rounded bg-red-600 hover:bg-red-700 text-white"
                        >
                            Export Schema
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
