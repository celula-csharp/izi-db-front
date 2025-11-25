import { useEffect, useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { studentService } from "@/api/studentService";

type Instance = {
    id: string | number;
    name: string;
    engine: string;
    port?: number;
    host?: string;
    status?: string;
    createdAt?: string;
};

const StudentIndex: FC = () => {
    const [instances, setInstances] = useState<Instance[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchInstances();
    }, []);

    async function fetchInstances() {
        setLoading(true);
        setError(null);
        try {
            const res = await studentService.getInstances();

            const data = (res.data ?? res) as Instance[];
            setInstances(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error("fetchInstances", err);
            setError(err?.message || "Error cargando instancias");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Panel Estudiante</h1>
                    <p className="text-sm text-gray-400">Tus instancias asignadas y accesos rápidos.</p>
                </div>

                <div className="flex gap-2">
                    {/* --- BOTÓN AÑADIDO: PÁGINA PRINCIPAL (HOME) --- */}
                    <button
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500"
                    >
                        Página Principal
                    </button>
                    {/* ------------------------------------------------ */}

                    <button
                        onClick={() => navigate("/dashboard/student/dashboard")}
                        className="px-4 py-2 bg-sky-600 rounded text-white"
                    >
                        Ir a Dashboard
                    </button>
                    <Link
                        to="/dashboard/student/query"
                        className="px-4 py-2 bg-gray-700 rounded text-white"
                    >
                        Abrir Query Editor
                    </Link>
                </div>
            </div>

            <section className="mb-6">
                <h2 className="text-lg font-medium mb-3">Instancias</h2>

                {loading && <div className="text-sm text-gray-400">Cargando...</div>}
                {error && <div className="text-sm text-red-400">Error: {error}</div>}

                {!loading && instances.length === 0 && (
                    <div className="p-4 border border-dashed border-gray-700 rounded bg-[#0b0c10] text-gray-300">
                        No tienes instancias asignadas.
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    {instances.map((it) => (
                        <div key={it.id} className="p-4 rounded border border-gray-800 bg-[#0f1116]">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-semibold">{it.name}</div>
                                    <div className="text-sm text-gray-400">{it.engine} • {it.host ?? "host"}:{it.port ?? "-"}</div>
                                </div>

                                <div className="text-right">
                                    <div className={`text-xs px-2 py-1 rounded-full ${it.status === "running" ? "bg-green-700" : "bg-gray-700"} text-white`}>
                                        {it.status ?? "unknown"}
                                    </div>

                                    <div className="mt-2 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/dashboard/student/${it.id}/data`)}
                                            className="text-xs px-2 py-1 rounded bg-gray-800"
                                        >
                                            Data
                                        </button>
                                        <button
                                            onClick={() => navigate(`/dashboard/student/query?instance=${it.id}`)}
                                            className="text-xs px-2 py-1 rounded bg-gray-800"
                                        >
                                            Query
                                        </button>
                                        <button
                                            onClick={() => navigate(`/dashboard/student/${it.id}/logs`)}
                                            className="text-xs px-2 py-1 rounded bg-gray-800"
                                        >
                                            Logs
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 text-xs text-gray-400">Creada: {it.createdAt ? new Date(it.createdAt).toLocaleString() : "-"}</div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default StudentIndex;