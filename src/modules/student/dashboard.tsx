import { useEffect, useState } from "react";
import axios from "axios";

// ------------------------------
// UTIL: Normalización del API
// ------------------------------
const raw = (import.meta.env?.VITE_API_URL as string) ?? "http://localhost:5000";
const API_BASE = raw.replace(/\/+$/, ""); // elimina / sobrantes

console.log("🔧 VITE_API_URL =", import.meta.env.VITE_API_URL);
console.log("🔧 API_BASE =", API_BASE);

// ------------------------------
// TIPOS
// ------------------------------
interface Instance {
    id: string;
    name: string;
    engine: string;
    host?: string;
    port?: number;
    status?: string;
    createdAt?: string;
}

// ------------------------------
// COMPONENTE
// ------------------------------
export default function StudentDashboard() {
    const [instances, setInstances] = useState<Instance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ------------------------------
    // FETCH: todas las instancias
    // ------------------------------
    const getInstances = async () => {
        setLoading(true);
        setError(null);

        try {
            const url = `${API_BASE}/DatabaseInstances`;
            console.log("🔵 GET →", url);

            const res = await axios.get(url);
            setInstances(res.data);
        } catch (err: any) {
            console.error("❌ Error GET /DatabaseInstances:", err);
            setError(err?.response?.data?.message || "Error obteniendo instancias");
        } finally {
            setLoading(false);
        }
    };

    // ------------------------------
    // START
    // ------------------------------
    const startInstance = async (id: string) => {
        try {
            const url = `${API_BASE}/DatabaseInstances/${id}/start`;
            console.log("🟢 START →", url);

            await axios.post(url);
            await getInstances();
        } catch (err: any) {
            console.error("❌ Error al iniciar:", err);
            alert("No se pudo iniciar la instancia");
        }
    };

    // ------------------------------
    // STOP
    // ------------------------------
    const stopInstance = async (id: string) => {
        try {
            const url = `${API_BASE}/DatabaseInstances/${id}/stop`;
            console.log("🔴 STOP →", url);

            await axios.post(url);
            await getInstances();
        } catch (err: any) {
            console.error("❌ Error al detener:", err);
            alert("No se pudo detener la instancia");
        }
    };

    // ------------------------------
    // DELETE
    // ------------------------------
    const deleteInstance = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar esta instancia?")) return;

        try {
            const url = `${API_BASE}/DatabaseInstances/${id}`;
            console.log("🗑️ DELETE →", url);

            await axios.delete(url);
            await getInstances();
        } catch (err: any) {
            console.error("❌ Error al eliminar:", err);
            alert("No se pudo eliminar la instancia");
        }
    };

    // ------------------------------
    // LOAD EFFECT
    // ------------------------------
    useEffect(() => {
        getInstances();
    }, []);

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-semibold mb-4">Student Dashboard</h1>

            {/* Estado */}
            {loading && <p className="text-gray-400">Cargando...</p>}
            {error && <p className="text-red-400">Error: {error}</p>}

            {/* Lista */}
            {!loading && instances.length === 0 && (
                <div className="p-4 border border-gray-700 rounded bg-[#0b0c10] text-gray-300">
                    No tienes instancias asignadas.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {instances.map((it) => (
                    <div key={it.id} className="p-4 border border-gray-800 rounded bg-[#0f1116]">
                        <div className="flex justify-between">
                            <div>
                                <h2 className="font-semibold">{it.name}</h2>
                                <p className="text-sm text-gray-400">
                                    {it.engine} • {it.host}:{it.port}
                                </p>
                            </div>

                            <span
                                className={`px-2 py-1 rounded text-xs ${
                                    it.status === "running" ? "bg-green-700" : "bg-gray-700"
                                }`}
                            >
                                {it.status}
                            </span>
                        </div>

                        {/* Botones */}
                        <div className="mt-3 flex gap-2">
                            {it.status !== "running" ? (
                                <button
                                    onClick={() => startInstance(it.id)}
                                    className="px-3 py-1 text-xs bg-green-800 rounded"
                                >
                                    Start
                                </button>
                            ) : (
                                <button
                                    onClick={() => stopInstance(it.id)}
                                    className="px-3 py-1 text-xs bg-yellow-700 rounded"
                                >
                                    Stop
                                </button>
                            )}

                            <button
                                onClick={() => deleteInstance(it.id)}
                                className="px-3 py-1 text-xs bg-red-700 rounded"
                            >
                                Delete
                            </button>
                        </div>

                        {/* Fecha */}
                        <p className="text-xs text-gray-400 mt-2">
                            Creada: {it.createdAt ? new Date(it.createdAt).toLocaleString() : "-"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
