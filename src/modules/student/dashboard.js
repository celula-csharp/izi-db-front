import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import axios from "axios";
// ------------------------------
// UTIL: Normalización del API
// ------------------------------
const raw = import.meta.env?.VITE_API_URL ?? "http://localhost:5000";
const API_BASE = raw.replace(/\/+$/, ""); // elimina / sobrantes
console.log("🔧 VITE_API_URL =", import.meta.env.VITE_API_URL);
console.log("🔧 API_BASE =", API_BASE);
// ------------------------------
// COMPONENTE
// ------------------------------
export default function StudentDashboard() {
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
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
        }
        catch (err) {
            console.error("❌ Error GET /DatabaseInstances:", err);
            setError(err?.response?.data?.message || "Error obteniendo instancias");
        }
        finally {
            setLoading(false);
        }
    };
    // ------------------------------
    // START
    // ------------------------------
    const startInstance = async (id) => {
        try {
            const url = `${API_BASE}/DatabaseInstances/${id}/start`;
            console.log("🟢 START →", url);
            await axios.post(url);
            await getInstances();
        }
        catch (err) {
            console.error("❌ Error al iniciar:", err);
            alert("No se pudo iniciar la instancia");
        }
    };
    // ------------------------------
    // STOP
    // ------------------------------
    const stopInstance = async (id) => {
        try {
            const url = `${API_BASE}/DatabaseInstances/${id}/stop`;
            console.log("🔴 STOP →", url);
            await axios.post(url);
            await getInstances();
        }
        catch (err) {
            console.error("❌ Error al detener:", err);
            alert("No se pudo detener la instancia");
        }
    };
    // ------------------------------
    // DELETE
    // ------------------------------
    const deleteInstance = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar esta instancia?"))
            return;
        try {
            const url = `${API_BASE}/DatabaseInstances/${id}`;
            console.log("🗑️ DELETE →", url);
            await axios.delete(url);
            await getInstances();
        }
        catch (err) {
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
    return (_jsxs("div", { className: "p-6 text-white", children: [_jsx("h1", { className: "text-2xl font-semibold mb-4", children: "Student Dashboard" }), loading && _jsx("p", { className: "text-gray-400", children: "Cargando..." }), error && _jsxs("p", { className: "text-red-400", children: ["Error: ", error] }), !loading && instances.length === 0 && (_jsx("div", { className: "p-4 border border-gray-700 rounded bg-[#0b0c10] text-gray-300", children: "No tienes instancias asignadas." })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-4", children: instances.map((it) => (_jsxs("div", { className: "p-4 border border-gray-800 rounded bg-[#0f1116]", children: [_jsxs("div", { className: "flex justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-semibold", children: it.name }), _jsxs("p", { className: "text-sm text-gray-400", children: [it.engine, " \u2022 ", it.host, ":", it.port] })] }), _jsx("span", { className: `px-2 py-1 rounded text-xs ${it.status === "running" ? "bg-green-700" : "bg-gray-700"}`, children: it.status })] }), _jsxs("div", { className: "mt-3 flex gap-2", children: [it.status !== "running" ? (_jsx("button", { onClick: () => startInstance(it.id), className: "px-3 py-1 text-xs bg-green-800 rounded", children: "Start" })) : (_jsx("button", { onClick: () => stopInstance(it.id), className: "px-3 py-1 text-xs bg-yellow-700 rounded", children: "Stop" })), _jsx("button", { onClick: () => deleteInstance(it.id), className: "px-3 py-1 text-xs bg-red-700 rounded", children: "Delete" })] }), _jsxs("p", { className: "text-xs text-gray-400 mt-2", children: ["Creada: ", it.createdAt ? new Date(it.createdAt).toLocaleString() : "-"] })] }, it.id))) })] }));
}
