import React, {JSX, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";



const API_BASE =
    (import.meta.env && (import.meta.env.VITE_API_BASE as string)) ||
    "http://localhost:5000/api/student";

type Instance = {
    id: string | number;
    name: string;
    engine: string;
    port?: number;
    host?: string;
    username?: string;
    status: "running" | "stopped" | "provisioning" | "error" | string;
    createdAt?: string;
};

export default function StudentDashboard(): JSX.Element {
    const [instances, setInstances] = useState<Instance[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [showCreate, setShowCreate] = useState(false);
    const [creating, setCreating] = useState(false);

    // form state for create instance
    const [form, setForm] = useState({
        name: "",
        engine: "postgres",
        port: "",
        username: "",
        password: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchInstances();
    }, []);

    async function fetchInstances() {
        setLoading(true);
        setError(null);
        try {
            // CORRECCIÓN TS6133: Usamos desestructuración { data }
            const { data } = await axios.get(`${API_BASE}/instances`);
            setInstances(data || []);
        } catch (err: any) {
            console.error("fetchInstances error", err);
            setError(err?.message || "Error loading instances");
        } finally {
            setLoading(false);
        }
    }

    async function handleAction(instId: string | number, action: "start" | "stop" | "restart" | "delete") {
        try {
            // optimistic UI: update status locally for quick feedback
            setInstances((prev) =>
                prev.map((it) =>
                    it.id === instId
                        ? { ...it, status: action === "start" ? "starting" : action === "stop" ? "stopping" : "restarting" }
                        : it
                )
            );

            await axios.post(`${API_BASE}/instances/${instId}/action`, { action });
            // refetch to get final state
            await fetchInstances();
        } catch (err) {
            console.error("action error", err);
            setError("Action failed");
            // fetch to reconcile state
            fetchInstances();
        }
    }

    async function handleCreate(e?: React.FormEvent) {
        e?.preventDefault();
        setCreating(true);
        setError(null);

        try {
            const payload = {
                name: form.name || `${form.engine}-sandbox-${Math.random().toString(36).slice(2,6)}`,
                engine: form.engine,
                port: form.port ? Number(form.port) : undefined,
                username: form.username || undefined,
                password: form.password || undefined,
            };

            // CORRECCIÓN TS6133: Eliminamos 'const res =' ya que no se usa
            await axios.post(`${API_BASE}/instances`, payload);

            setShowCreate(false);
            setForm({ name: "", engine: "postgres", port: "", username: "", password: "" });
            // refresh instances
            await fetchInstances();
        } catch (err) {
            console.error("create instance error", err);
            setError("Could not create instance");
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="w-full h-full text-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold">My Instances</h2>
                    <p className="text-sm text-gray-400">Administra tus motores de base de datos asignados.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => navigate("/student/")}
                        className="px-4 py-2 bg-gray-600 rounded-md text-white hover:bg-gray-500"
                    >
                        Volver
                    </button>
                    {/* -------------------------------------------------- */}

                    <button
                        onClick={() => navigate("/student/query")}
                        className="px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-500"
                    >
                        Abrir Query Editor
                    </button>

                    <button
                        onClick={() => setShowCreate(true)}
                        className="px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-500"
                    >
                        Crear instancia
                    </button>
                </div>
            </div>

            {/* Metrics / quick summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-[#111318] rounded-lg border border-gray-800">
                    <div className="text-sm text-gray-400">Instancias</div>
                    <div className="text-2xl font-bold">{instances.length}</div>
                </div>
                <div className="p-4 bg-[#111318] rounded-lg border border-gray-800">
                    <div className="text-sm text-gray-400">En ejecución</div>
                    <div className="text-2xl font-bold">{instances.filter((i) => i.status === "running").length}</div>
                </div>
                <div className="p-4 bg-[#111318] rounded-lg border border-gray-800">
                    <div className="text-sm text-gray-400">Detenidas</div>
                    <div className="text-2xl font-bold">{instances.filter((i) => i.status === "stopped").length}</div>
                </div>
            </div>

            {/* Instances list */}
            <div className="space-y-3">
                {loading && <div className="text-gray-400">Cargando instancias...</div>}
                {error && <div className="text-red-400">Error: {error}</div>}

                {!loading && instances.length === 0 && (
                    <div className="p-6 bg-[#0f1116] rounded-lg border border-dashed border-gray-700 text-center">
                        <p className="mb-3 text-gray-300">No tienes instancias todavía.</p>
                        <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-green-600 rounded-md">
                            Crear primera instancia
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {instances.map((inst) => (
                        <div key={inst.id} className="p-4 bg-[#0e1116] rounded-lg border border-gray-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center text-lg">
                                            {inst.engine?.slice(0,1)?.toUpperCase() || "DB"}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{inst.name}</div>
                                            <div className="text-xs text-gray-400">
                                                {inst.engine} • {inst.host || "host"}:{inst.port || "-"}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            inst.status === "running" ? "bg-green-700 text-white" : "bg-gray-700 text-gray-200"
                                        }`}
                                    >
                                        {inst.status}
                                    </div>
                                    <div className="mt-2 flex gap-2">
                                        {inst.status !== "running" && (
                                            <button
                                                onClick={() => handleAction(inst.id, "start")}
                                                className="px-2 py-1 text-sm rounded bg-blue-600 hover:bg-blue-500"
                                            >
                                                Start
                                            </button>
                                        )}
                                        {inst.status === "running" && (
                                            <button
                                                onClick={() => handleAction(inst.id, "stop")}
                                                className="px-2 py-1 text-sm rounded bg-orange-600 hover:bg-orange-500"
                                            >
                                                Stop
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleAction(inst.id, "restart")}
                                            className="px-2 py-1 text-sm rounded bg-yellow-600 hover:bg-yellow-500"
                                        >
                                            Restart
                                        </button>

                                        <button
                                            onClick={() => handleAction(inst.id, "delete")}
                                            className="px-2 py-1 text-sm rounded bg-red-600 hover:bg-red-500"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 flex gap-3">
                                <button
                                    onClick={() => navigate(`/student/${inst.id}/data`)}
                                    className="px-3 py-1 rounded bg-[#1f2937] text-sm"
                                >
                                    Data Explorer
                                </button>
                                <button
                                    onClick={() => navigate(`/student/query?instance=${inst.id}`)}
                                    className="px-3 py-1 rounded bg-[#1f2937] text-sm"
                                >
                                    Query Editor
                                </button>
                                <button
                                    onClick={() => navigate(`/student/${inst.id}/logs`)}
                                    className="px-3 py-1 rounded bg-[#1f2937] text-sm"
                                >
                                    Logs
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Instance Modal */}
            {showCreate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
                    <form
                        onSubmit={handleCreate}
                        className="w-full max-w-lg bg-[#0b0c10] p-6 rounded-lg border border-gray-800"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Crear nueva instancia</h3>
                            <button type="button" onClick={() => setShowCreate(false)} className="text-gray-400">
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-sm text-gray-300 block mb-1">Nombre</label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                                    className="w-full px-3 py-2 bg-[#0f1116] border border-gray-700 rounded"
                                    placeholder="mi-instancia-1"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-1">Motor</label>
                                <select
                                    value={form.engine}
                                    onChange={(e) => setForm((s) => ({ ...s, engine: e.target.value }))}
                                    className="w-full px-3 py-2 bg-[#0f1116] border border-gray-700 rounded"
                                >
                                    <option value="postgres">Postgres</option>
                                    <option value="mysql">MySQL</option>
                                    <option value="mongodb">MongoDB</option>
                                    <option value="sqlserver">SQL Server</option>
                                    <option value="redis">Redis</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-1">Puerto (opcional)</label>
                                <input
                                    value={form.port}
                                    onChange={(e) => setForm((s) => ({ ...s, port: e.target.value }))}
                                    className="w-full px-3 py-2 bg-[#0f1116] border border-gray-700 rounded"
                                    placeholder="5432"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-1">Usuario (opcional)</label>
                                <input
                                    value={form.username}
                                    onChange={(e) => setForm((s) => ({ ...s, username: e.target.value }))}
                                    className="w-full px-3 py-2 bg-[#0f1116] border border-gray-700 rounded"
                                    placeholder="db_user"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-300 block mb-1">Password (opcional)</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
                                    className="w-full px-3 py-2 bg-[#0f1116] border border-gray-700 rounded"
                                    placeholder="********"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setShowCreate(false)}
                                className="px-4 py-2 rounded bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={creating}
                                className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white"
                            >
                                {creating ? "Creating..." : "Create Instance"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}