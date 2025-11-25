/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

// URL base del backend
const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/student";

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
  getInstances: async (id: string | undefined) => {
    return api.get(`/DatabaseInstances/user/${id}`);
  },

  createInstance: async (
    name: string,
    description: string,
    ownerId: string
  ) => {
    return api.post(`/DatabaseInstances`, {
      name: name,
      description: description,
      ownerId: ownerId,
    });
  },

  // Obtener detalles de una instancia específica
  getInstanceById: async (instanceId: string) => {
    return api.get(`/DatabaseInstances/${instanceId}`);
  },
  insertDocument: async (
    instanceId: string,
    collectionName: string,
    document: any,
    databaseName?: string
  ) => {
    try {
      const instanceRes = await api.get(`/DatabaseInstances/${instanceId}`);
      const instance = instanceRes.data;

      const requestBody = {
        connectionString:
          instance.connectionInfo?.connectionString ||
          "mongodb+srv://tekazp:tekazp@mongodbprovider.nzfhohd.mongodb.net/",
        databaseName: databaseName || "test",
        collectionName: collectionName,
        document: document,
      };

      console.log(
        "Insert document request:",
        JSON.stringify(requestBody, null, 2)
      );

      return api.post(`/DatabaseInstances/documents/insert`, requestBody);
    } catch (error) {
      console.error("Error inserting document:", error);
      throw error;
    }
  },

  // Ejecutar una consulta en MongoDB - FORMATO CORREGIDO
  executeQuery: async (
    instanceId: string,
    query: string,
    collectionName?: string,
    databaseName?: string
  ) => {
    try {
      // Primero obtenemos la información de la instancia
      const instanceRes = await api.get(`/DatabaseInstances/${instanceId}`);
      const instance = instanceRes.data;

      // Convertir la consulta MongoDB a un filtro JSON válido
      const parsedQuery = mongoQueryConverter.convertToFilter(query);

      // Formato según el backend - objeto MongoQueryDto directo
      const requestBody = {
        connectionString:
          instance.connectionInfo?.connectionString ||
          "mongodb+srv://tekazp:tekazp@mongodbprovider.nzfhohd.mongodb.net/",
        databaseName: databaseName || "",
        collectionName:
          collectionName || studentService.extractCollectionName(query),
        query: parsedQuery, // Filtro JSON como string
      };

      console.log("Sending request:", JSON.stringify(requestBody, null, 2));

      return api.post(`/DatabaseInstances/query`, requestBody);
    } catch (error) {
      console.error("Error in executeQuery:", error);
      throw error;
    }
  },

  // Obtener entidades (tablas, colecciones, keys)
  getEntities: async (instanceId: string) => {
    return api.get(`/DatabaseInstances/${instanceId}/entities`);
  },

  // CRUD dinámico
  createRecord: async (instanceId: string, entity: string, data: any) => {
    return api.post(`/DatabaseInstances/${instanceId}/entity/${entity}`, data);
  },

  updateRecord: async (
    instanceId: string,
    entity: string,
    id: string,
    data: any
  ) => {
    return api.put(
      `/DatabaseInstances/${instanceId}/entity/${entity}/${id}`,
      data
    );
  },

  deleteRecord: async (instanceId: string, entity: string, id: string) => {
    return api.delete(
      `/DatabaseInstances/${instanceId}/entity/${entity}/${id}`
    );
  },

  // Exportación (CSV, JSON)
  exportData: async (
    instanceId: string,
    entity: string,
    format: "csv" | "json"
  ) => {
    return api.get(
      `/DatabaseInstances/${instanceId}/entity/${entity}/export?format=${format}`,
      {
        responseType: "blob",
      }
    );
  },

  // Método helper para extraer el nombre de la colección
  extractCollectionName: (query: string): string => {
    const match = query.match(/db\.(\w+)\./);
    return match ? match[1] : "unknown";
  },

  // Método para limpiar consultas MongoDB
  sanitizeMongoQuery: (query: string): string => {
    return query
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();
  },
};

// Conversor de consultas MongoDB a filtros JSON
export const mongoQueryConverter = {
  // Convertir consulta MongoDB completa a filtro JSON
  convertToFilter: (query: string): string => {
    const cleanQuery = query
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .trim();

    try {
      // Para consultas find
      if (cleanQuery.includes(".find(")) {
        return mongoQueryConverter.extractFindFilter(cleanQuery);
      }
      // Para otras operaciones, devolver la consulta completa
      else {
        return JSON.stringify({ query: cleanQuery });
      }
    } catch (error) {
      console.error("Error converting query:", error);
      return JSON.stringify({ error: "Invalid query format" });
    }
  },

  // Extraer filtro de consultas find
  extractFindFilter: (query: string): string => {
    // Buscar el contenido dentro de find()
    const findMatch = query.match(
      /\.find\(\s*({[^}]*}(?:\s*,\s*{[^}]*})?)\s*\)/
    );
    if (!findMatch) {
      return "{}"; // Filtro vacío
    }

    const params = findMatch[1].trim();

    // Si hay múltiples parámetros, tomar solo el primero (filtro)
    const firstParamMatch = params.match(/^({[^}]*})/);
    if (firstParamMatch) {
      const filterStr = firstParamMatch[1];

      // Convertir a JSON válido
      try {
        const jsonStr = filterStr
          .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Comillas en keys
          .replace(/'/g, '"') // Comillas simples a dobles
          .replace(/\$(\w+)/g, '"$$$1"'); // Preservar operadores $

        // Validar que sea JSON válido
        JSON.parse(jsonStr);
        return jsonStr;
      } catch (error) {
        console.warn("Invalid JSON in filter, returning empty filter");
        return "{}";
      }
    }

    return "{}";
  },

  // Extraer pipeline de agregación
  extractAggregatePipeline: (query: string): string => {
    const aggMatch = query.match(/\.aggregate\(\s*(\[[\s\S]*\])\s*\)/);
    if (!aggMatch) {
      return "[]";
    }

    try {
      const pipelineStr = aggMatch[1]
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"');

      JSON.parse(pipelineStr);
      return pipelineStr;
    } catch (error) {
      return "[]";
    }
  },
};
