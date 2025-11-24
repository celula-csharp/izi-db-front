interface InstanceInfoProps {
    entity: string | null;
    records: any[];
}

export default function InstanceInfoPanel({ entity, records }: InstanceInfoProps) {
    if (!entity || !records.length) return null;

    const total = records.length;
    const columns = Object.keys(records[0]);

    const dates = records
        .map((r) => new Date(r.createdAt))
        .filter((d) => !isNaN(d.getTime()));

    const firstDate =
        dates.length ? dates[0].toISOString().split("T")[0] : "—";
    const lastDate =
        dates.length ? dates[dates.length - 1].toISOString().split("T")[0] : "—";

    return (
        <div className="mt-5 bg-[#0d0f16] border border-gray-700 rounded-xl p-4">
            <h3 className="text-md font-semibold mb-3">Información de la entidad</h3>

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                    <p className="text-gray-400 text-xs">Nombre</p>
                    <p className="font-medium">{entity}</p>
                </div>

                <div>
                    <p className="text-gray-400 text-xs">Total de registros</p>
                    <p className="font-medium">{total}</p>
                </div>

                <div>
                    <p className="text-gray-400 text-xs">Columnas</p>
                    <p className="font-medium">{columns.join(", ")}</p>
                </div>

                <div>
                    <p className="text-gray-400 text-xs">Fecha mínima</p>
                    <p className="font-medium">{firstDate}</p>
                </div>

                <div>
                    <p className="text-gray-400 text-xs">Fecha máxima</p>
                    <p className="font-medium">{lastDate}</p>
                </div>
            </div>
        </div>
    );
}
