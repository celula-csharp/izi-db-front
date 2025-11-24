import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { studentService } from "@/api/studentService";
const StudentIndex = () => {
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        fetchInstances();
    }, []);
    async function fetchInstances() {
        setLoading(true);
        setError(null);
        try {
            const res = await studentService.getInstances();
            const data = (res.data ?? res);
            setInstances(Array.isArray(data) ? data : []);
        }
        catch (err) {
            console.error("fetchInstances", err);
            setError(err?.message || "Error cargando instancias");
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsxs("div", { className: "w-full", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold", children: "Panel Estudiante" }), _jsx("p", { className: "text-sm text-gray-400", children: "Tus instancias asignadas y accesos r\u00E1pidos." })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => navigate("/"), className: "px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-500", children: "P\u00E1gina Principal" }), _jsx("button", { onClick: () => navigate("/student/dashboard"), className: "px-4 py-2 bg-sky-600 rounded text-white", children: "Ir a Dashboard" }), _jsx(Link, { to: "/student/query", className: "px-4 py-2 bg-gray-700 rounded text-white", children: "Abrir Query Editor" })] })] }), _jsxs("section", { className: "mb-6", children: [_jsx("h2", { className: "text-lg font-medium mb-3", children: "Instancias" }), loading && _jsx("div", { className: "text-sm text-gray-400", children: "Cargando..." }), error && _jsxs("div", { className: "text-sm text-red-400", children: ["Error: ", error] }), !loading && instances.length === 0 && (_jsx("div", { className: "p-4 border border-dashed border-gray-700 rounded bg-[#0b0c10] text-gray-300", children: "No tienes instancias asignadas." })), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mt-3", children: instances.map((it) => (_jsxs("div", { className: "p-4 rounded border border-gray-800 bg-[#0f1116]", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("div", { className: "font-semibold", children: it.name }), _jsxs("div", { className: "text-sm text-gray-400", children: [it.engine, " \u2022 ", it.host ?? "host", ":", it.port ?? "-"] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: `text-xs px-2 py-1 rounded-full ${it.status === "running" ? "bg-green-700" : "bg-gray-700"} text-white`, children: it.status ?? "unknown" }), _jsxs("div", { className: "mt-2 flex gap-2", children: [_jsx("button", { onClick: () => navigate(`/student/${it.id}/data`), className: "text-xs px-2 py-1 rounded bg-gray-800", children: "Data" }), _jsx("button", { onClick: () => navigate(`/student/query?instance=${it.id}`), className: "text-xs px-2 py-1 rounded bg-gray-800", children: "Query" }), _jsx("button", { onClick: () => navigate(`/student/${it.id}/logs`), className: "text-xs px-2 py-1 rounded bg-gray-800", children: "Logs" })] })] })] }), _jsxs("div", { className: "mt-3 text-xs text-gray-400", children: ["Creada: ", it.createdAt ? new Date(it.createdAt).toLocaleString() : "-"] })] }, it.id))) })] })] }));
};
export default StudentIndex;
