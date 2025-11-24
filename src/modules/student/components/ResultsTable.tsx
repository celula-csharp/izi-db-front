import React from "react";

interface ResultsTableProps {
    data: any[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data }) => {
    if (!data || data.length === 0)
        return <p className="text-gray-400 text-sm">No hay resultados para mostrar.</p>;

    const columns = Object.keys(data[0] || {});

    return (
        <div className="overflow-auto border border-gray-700 rounded-lg">
            <table className="w-full text-left text-sm text-gray-200">
                <thead className="bg-gray-800 text-gray-300">
                <tr>
                    {columns.map((col) => (
                        <th key={col} className="px-4 py-2 border-b border-gray-700">
                            {col}
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {data.map((row, idx) => (
                    <tr key={idx} className="even:bg-gray-900 odd:bg-gray-800">
                        {columns.map((col) => (
                            <td key={col} className="px-4 py-2 border-b border-gray-700">
                                {String(row[col] ?? "")}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsTable;
