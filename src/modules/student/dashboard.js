import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE = (import.meta.env && import.meta.env.VITE_API_BASE) ||
    "http://localhost:5000/api/student";
export default function StudentDashboard() {
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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
        }
        catch (err) {
            console.error("fetchInstances error", err);
            setError(err?.message || "Error loading instances");
        }
        finally {
            setLoading(false);
        }
    }
    async function handleAction(instId, action) {
        try {
            // optimistic UI: update status locally for quick feedback
            setInstances((prev) => prev.map((it) => it.id === instId
                ? { ...it, status: action === "start" ? "starting" : action === "stop" ? "stopping" : "restarting" }
                : it));
            await axios.post(`${API_BASE}/instances/${instId}/action`, { action });
            // refetch to get final state
            await fetchInstances();
        }
        catch (err) {
            console.error("action error", err);
            setError("Action failed");
            // fetch to reconcile state
            fetchInstances();
        }
    }
    async function handleCreate(e) {
        e?.preventDefault();
        setCreating(true);
        setError(null);
        try {
            const payload = {
                name: form.name || `${form.engine}-sandbox-${Math.random().toString(36).slice(2, 6)}`,
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
        }
        catch (err) {
            console.error("create instance error", err);
            setError("Could not create instance");
        }
        finally {
            setCreating(false);
        }
    }
    return (_jsxs("div", { className: "w-full h-full text-gray-100", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold", children: "My Instances" }), _jsx("p", { className: "text-sm text-gray-400", children: "Administra tus motores de base de datos asignados." })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => navigate("/student/"), className: "px-4 py-2 bg-gray-600 rounded-md text-white hover:bg-gray-500", children: "Volver" }), _jsx("button", { onClick: () => navigate("/student/query"), className: "px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-500", children: "Abrir Query Editor" }), _jsx("button", { onClick: () => setShowCreate(true), className: "px-4 py-2 bg-green-600 rounded-md text-white hover:bg-green-500", children: "Crear instancia" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6", children: [_jsxs("div", { className: "p-4 bg-[#111318] rounded-lg border border-gray-800", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Instancias" }), _jsx("div", { className: "text-2xl font-bold", children: instances.length })] }), _jsxs("div", { className: "p-4 bg-[#111318] rounded-lg border border-gray-800", children: [_jsx("div", { className: "text-sm text-gray-400", children: "En ejecuci\u00F3n" }), _jsx("div", { className: "text-2xl font-bold", children: instances.filter((i) => i.status === "running").length })] }), _jsxs("div", { className: "p-4 bg-[#111318] rounded-lg border border-gray-800", children: [_jsx("div", { className: "text-sm text-gray-400", children: "Detenidas" }), _jsx("div", { className: "text-2xl font-bold", children: instances.filter((i) => i.status === "stopped").length })] })] }), _jsxs("div", { className: "space-y-3", children: [loading && _jsx("div", { className: "text-gray-400", children: "Cargando instancias..." }), error && _jsxs("div", { className: "text-red-400", children: ["Error: ", error] }), !loading && instances.length === 0 && (_jsxs("div", { className: "p-6 bg-[#0f1116] rounded-lg border border-dashed border-gray-700 text-center", children: [_jsx("p", { className: "mb-3 text-gray-300", children: "No tienes instancias todav\u00EDa." }), _jsx("button", { onClick: () => setShowCreate(true), className: "px-4 py-2 bg-green-600 rounded-md", children: "Crear primera instancia" })] })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: instances.map((inst) => (_jsxs("div", { className: "p-4 bg-[#0e1116] rounded-lg border border-gray-800", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("div", { children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-md bg-gray-800 flex items-center justify-center text-lg", children: inst.engine?.slice(0, 1)?.toUpperCase() || "DB" }), _jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: inst.name }), _jsxs("div", { className: "text-xs text-gray-400", children: [inst.engine, " \u2022 ", inst.host || "host", ":", inst.port || "-"] })] })] }) }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: `px-2 py-1 rounded-full text-xs font-medium ${inst.status === "running" ? "bg-green-700 text-white" : "bg-gray-700 text-gray-200"}`, children: inst.status }), _jsxs("div", { className: "mt-2 flex gap-2", children: [inst.status !== "running" && (_jsx("button", { onClick: () => handleAction(inst.id, "start"), className: "px-2 py-1 text-sm rounded bg-blue-600 hover:bg-blue-500", children: "Start" })), inst.status === "running" && (_jsx("button", { onClick: () => handleAction(inst.id, "stop"), className: "px-2 py-1 text-sm rounded bg-orange-600 hover:bg-orange-500", children: "Stop" })), _jsx("button", { onClick: () => handleAction(inst.id, "restart"), className: "px-2 py-1 text-sm rounded bg-yellow-600 hover:bg-yellow-500", children: "Restart" }), _jsx("button", { onClick: () => handleAction(inst.id, "delete"), className: "px-2 py-1 text-sm rounded bg-red-600 hover:bg-red-500", children: "Delete" })] })] })] }), _jsxs("div", { className: "mt-3 flex gap-3", children: [_jsx("button", { onClick: () => navigate(`/student/${inst.id}/data`), className: "px-3 py-1 rounded bg-[#1f2937] text-sm", children: "Data Explorer" }), _jsx("button", { onClick: () => navigate(`/student/query?instance=${inst.id}`), className: "px-3 py-1 rounded bg-[#1f2937] text-sm", children: "Query Editor" }), _jsx("button", { onClick: () => navigate(`/student/${inst.id}/logs`), className: "px-3 py-1 rounded bg-[#1f2937] text-sm", children: "Logs" })] })] }, inst.id))) })] }), showCreate && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-40", children: _jsxs("form", { onSubmit: handleCreate, className: "w-full max-w-lg bg-[#0b0c10] p-6 rounded-lg border border-gray-800", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Crear nueva instancia" }), _jsx("button", { type: "button", onClick: () => setShowCreate(false), className: "text-gray-400", children: "\u2715" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-300 block mb-1", children: "Nombre" }), _jsx("input", { value: form.name, onChange: (e) => setForm((s) => ({ ...s, name: e.target.value })), className: "w-full px-3 py-2 bg-[#0f1116] border border-gray-700 rounded", placeholder: "mi-instancia-1" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-300 block mb-1", children: "Motor" }), _jsxs("select", { value: form.engine, onChange: (e) => setForm((s) => ({ ...s, engine: e.target.value })), className: "w-full px-3 py-2 bg-[#0f1116] border border-gray-700 rounded", children: [_jsx("option", { value: "postgres", children: "Postgres" }), _jsx("option", { value: "mysql", children: "MySQL" }), _jsx("option", { value: "mongodb", children: "MongoDB" }), _jsx("option", { value: "sqlserver", children: "SQL Server" }), _jsx("option", { value: "redis", children: "Redis" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-300 block mb-1", children: "Puerto (opcional)" }), _jsx("input", { value: form.port, onChange: (e) => setForm((s) => ({ ...s, port: e.target.value })), className: "w-full px-3 py-2 bg-[#0f1116] border border-gray-700 rounded", placeholder: "5432" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm text-gray-300 block mb-1", children: "Usuario (opcional)" }), _jsx("input", { value: form.username, onChange: (e) => setForm((s) => ({ ...s, username: e.target.value })), className: "w-full px-3 py-2 bg-[#0f1116] border border-gray-700 rounded", placeholder: "db_user" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "text-sm text-gray-300 block mb-1", children: "Password (opcional)" }), _jsx("input", { type: "password", value: form.password, onChange: (e) => setForm((s) => ({ ...s, password: e.target.value })), className: "w-full px-3 py-2 bg-[#0f1116] border border-gray-700 rounded", placeholder: "********" })] })] }), _jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [_jsx("button", { type: "button", onClick: () => setShowCreate(false), className: "px-4 py-2 rounded bg-gray-700", children: "Cancel" }), _jsx("button", { type: "submit", disabled: creating, className: "px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white", children: creating ? "Creating..." : "Create Instance" })] })] }) }))] }));
}
