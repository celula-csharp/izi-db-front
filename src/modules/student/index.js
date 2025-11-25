import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { studentService } from "@/api/studentService";
import { useAuth } from "@/auth/useAuth";
import { Activity, Database, FileText, Play, Plus, SquarePen, } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const StudentIndex = () => {
    const { user } = useAuth();
    const [instances, setInstances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        fetchInstances();
    }, [user?.id]);
    async function fetchInstances() {
        if (!user?.id) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await studentService.getInstances(user.id);
            const data = (res.data ?? res);
            setInstances(Array.isArray(data) ? data : []);
        }
        catch (err) {
            console.error("fetchInstances error:", err);
            setError(err?.response?.data?.message || "Error cargando instancias");
        }
        finally {
            setLoading(false);
        }
    }
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "running":
                return "bg-green-900/50 text-green-300 border-green-700";
            case "stopped":
                return "bg-red-900/50 text-red-300 border-red-700";
            case "starting":
                return "bg-yellow-900/50 text-yellow-300 border-yellow-700";
            default:
                return "bg-gray-700 text-gray-300 border-gray-600";
        }
    };
    const getEngineIcon = (engine) => {
        switch (engine?.toLowerCase()) {
            case "mysql":
                return "🟠";
            case "postgresql":
                return "🔵";
            case "mongodb":
                return "🟢";
            case "redis":
                return "🔴";
            default:
                return "⚫";
        }
    };
    console.log(instances);
    if (loading) {
        return (_jsx("div", { className: "w-full p-8", children: _jsxs("div", { className: "flex items-center justify-center", children: [_jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" }), _jsx("span", { className: "ml-3 text-gray-400", children: "Cargando instancias..." })] }) }));
    }
    return (_jsxs("div", { className: "w-full p-6", children: [_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white mb-2", children: "Panel del Estudiante" }), _jsx("p", { className: "text-gray-400", children: "Gestiona tus instancias de base de datos y herramientas de desarrollo" })] }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsxs(Link, { to: "/dashboard/student/new-instance", className: "flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-200", children: [_jsx(Plus, { className: "w-4 h-4" }), "Nueva Instancia"] }), _jsxs(Link, { to: "/dashboard/student/query", className: "flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200", children: [_jsx(SquarePen, { className: "w-4 h-4" }), "Editor de Queries"] })] })] }), _jsxs("section", { className: "mb-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h2", { className: "text-xl font-semibold text-white flex items-center gap-2", children: [_jsx(Database, { className: "w-5 h-5 text-blue-400" }), "Mis Instancias"] }), _jsxs("span", { className: "text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full", children: [instances.length, " instancia", instances.length !== 1 ? "s" : ""] })] }), error && (_jsx("div", { className: "bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { children: error }), _jsx("button", { onClick: fetchInstances, className: "text-red-300 hover:text-white text-sm underline", children: "Reintentar" })] }) })), !loading && instances.length === 0 && (_jsxs("div", { className: "text-center py-12 px-6 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/50", children: [_jsx(Database, { className: "w-16 h-16 text-gray-600 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-medium text-gray-300 mb-2", children: "No hay instancias" }), _jsx("p", { className: "text-gray-500 mb-6 max-w-md mx-auto", children: "Comienza creando tu primera instancia de base de datos para trabajar con diferentes motores." }), _jsxs(Link, { to: "/dashboard/student/new-instance", className: "inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200", children: [_jsx(Plus, { className: "w-4 h-4" }), "Crear Primera Instancia"] })] })), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6", children: instances.map((instance) => (_jsx("div", { className: "bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10", children: _jsxs("div", { className: "p-5", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "text-2xl", children: getEngineIcon(instance.engine) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-white text-lg truncate max-w-[180px]", children: instance.name }), _jsxs("p", { className: "text-sm text-gray-400", children: [instance.engine || "MongoDB", " \u2022", " ", instance.host || "localhost", ":", instance.port || "---"] })] })] }), _jsx("div", { className: `px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(instance.status)}`, children: instance.status || "Unknown" })] }), instance.description && (_jsx("p", { className: "text-gray-400 text-sm mb-4 line-clamp-2", children: instance.description })), _jsxs("div", { className: "flex items-center justify-between text-xs text-gray-500 mb-4", children: [_jsxs("span", { children: ["Creada:", " ", instance.createdAt
                                                        ? new Date(instance.createdAt).toLocaleDateString()
                                                        : "N/A"] }), _jsx("span", { children: instance.connectionInfo?.isSecure ? "🔒 SSL" : "🔓 No SSL" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: () => navigate(`/dashboard/student/${instance.id}/data`), className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors duration-200", children: [_jsx(FileText, { className: "w-4 h-4" }), "Datos"] }), _jsxs("button", { onClick: () => navigate(`/dashboard/student/query?instance=${instance.id}`), className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors duration-200", children: [_jsx(SquarePen, { className: "w-4 h-4" }), "Query"] }), _jsxs("button", { onClick: () => navigate(`/dashboard/student/${instance.id}/logs`), className: "flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors duration-200", children: [_jsx(Activity, { className: "w-4 h-4" }), "Logs"] })] })] }) }, instance.id))) })] }), _jsxs("section", { className: "bg-gray-800 rounded-xl p-6 border border-gray-700", children: [_jsxs("h2", { className: "text-xl font-semibold text-white mb-4 flex items-center gap-2", children: [_jsx(Play, { className: "w-5 h-5 text-green-400" }), "Acciones R\u00E1pidas"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4", children: [_jsx(Link, { to: "/dashboard/student/query", className: "p-4 bg-gray-750 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors duration-200 group", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-blue-900/50 rounded-lg group-hover:bg-blue-800/50 transition-colors", children: _jsx(SquarePen, { className: "w-5 h-5 text-blue-400" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-white", children: "Query Editor" }), _jsx("p", { className: "text-sm text-gray-400", children: "Ejecuta consultas SQL" })] })] }) }), _jsx(Link, { to: "/dashboard/student/documentation", className: "p-4 bg-gray-750 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors duration-200 group", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-green-900/50 rounded-lg group-hover:bg-green-800/50 transition-colors", children: _jsx(FileText, { className: "w-5 h-5 text-green-400" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-white", children: "Documentaci\u00F3n" }), _jsx("p", { className: "text-sm text-gray-400", children: "Gu\u00EDas y referencias" })] })] }) }), _jsx(Link, { to: "/dashboard/student/tutorials", className: "p-4 bg-gray-750 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors duration-200 group", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2 bg-purple-900/50 rounded-lg group-hover:bg-purple-800/50 transition-colors", children: _jsx(Activity, { className: "w-5 h-5 text-purple-400" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-white", children: "Tutoriales" }), _jsx("p", { className: "text-sm text-gray-400", children: "Aprende a usar la plataforma" })] })] }) })] })] })] }));
};
export default StudentIndex;
