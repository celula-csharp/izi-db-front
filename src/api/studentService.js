import axios from "axios";
// URL base del backend (cámbiala cuando el equipo la defina)
const API_URL = "http://localhost:5000/api/student";
// Axios instance con headers y JWT automático
const api = axios.create({
    baseURL: API_URL,
});
// Interceptor para agregar JWT si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// -----------------------------
// Servicios del módulo Student
// -----------------------------
export const studentService = {
    // Obtener las instancias que le pertenecen al estudiante
    getInstances: async () => {
        return api.get("/instances");
    },
    // Obtener detalles de una instancia específica
    getInstanceById: async (instanceId) => {
        return api.get(`/instances/${instanceId}`);
    },
    // Ejecutar una consulta en un motor
    executeQuery: async (instanceId, query) => {
        return api.post(`/instances/${instanceId}/query`, { query });
    },
    // Obtener entidades (tablas, colecciones, keys)
    getEntities: async (instanceId) => {
        return api.get(`/instances/${instanceId}/entities`);
    },
    // CRUD dinámico
    createRecord: async (instanceId, entity, data) => {
        return api.post(`/instances/${instanceId}/entity/${entity}`, data);
    },
    updateRecord: async (instanceId, entity, id, data) => {
        return api.put(`/instances/${instanceId}/entity/${entity}/${id}`, data);
    },
    deleteRecord: async (instanceId, entity, id) => {
        return api.delete(`/instances/${instanceId}/entity/${entity}/${id}`);
    },
    // Exportación (CSV, JSON)
    exportData: async (instanceId, entity, format) => {
        return api.get(`/instances/${instanceId}/entity/${entity}/export?format=${format}`, {
            responseType: "blob",
        });
    },
};
