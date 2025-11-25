import { studentService } from "@/api/studentService";
import { useAuth } from "@/auth/useAuth";
import {
  Activity,
  Database,
  FileText,
  Play,
  Plus,
  SquarePen,
} from "lucide-react";
import { useEffect, useState, type FC } from "react";
import { Link, useNavigate } from "react-router-dom";

type Instance = {
  id: string | number;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  isActive: boolean;
  engine?: string;
  host?: string;
  port?: number;
  status?: string;
  connectionInfo: {
    host: string;
    port: number;
    databaseName: string;
    connectionString: string;
    isSecure: boolean;
  };
};

const StudentIndex: FC = () => {
  const { user } = useAuth();
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
      const data = (res.data ?? res) as Instance[];
      setInstances(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("fetchInstances error:", err);
      setError(err?.response?.data?.message || "Error cargando instancias");
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string | undefined) => {
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

  const getEngineIcon = (engine?: string) => {
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
    return (
      <div className="w-full p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-400">Cargando instancias...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Panel del Estudiante
          </h1>
          <p className="text-gray-400">
            Gestiona tus instancias de base de datos y herramientas de
            desarrollo
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/dashboard/student/new-instance"
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Nueva Instancia
          </Link>
          <Link
            to="/dashboard/student/query"
            className="flex items-center gap-2 px-4 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors duration-200"
          >
            <SquarePen className="w-4 h-4" />
            Editor de Queries
          </Link>
        </div>
      </div>

      {/* Instances Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            Mis Instancias
          </h2>
          <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
            {instances.length} instancia{instances.length !== 1 ? "s" : ""}
          </span>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={fetchInstances}
                className="text-red-300 hover:text-white text-sm underline"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {!loading && instances.length === 0 && (
          <div className="text-center py-12 px-6 border-2 border-dashed border-gray-700 rounded-xl bg-gray-800/50">
            <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No hay instancias
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Comienza creando tu primera instancia de base de datos para
              trabajar con diferentes motores.
            </p>
            <Link
              to="/dashboard/student/new-instance"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Crear Primera Instancia
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {instances.map((instance) => (
            <div
              key={instance.id}
              className="bg-gray-800 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getEngineIcon(instance.engine)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg truncate max-w-[180px]">
                        {instance.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {instance.engine || "MongoDB"} •{" "}
                        {instance.host || "localhost"}:{instance.port || "---"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      instance.status
                    )}`}
                  >
                    {instance.status || "Unknown"}
                  </div>
                </div>

                {instance.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {instance.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>
                    Creada:{" "}
                    {instance.createdAt
                      ? new Date(instance.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                  <span>
                    {instance.connectionInfo?.isSecure ? "🔒 SSL" : "🔓 No SSL"}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/dashboard/student/${instance.id}/data`)
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors duration-200"
                  >
                    <FileText className="w-4 h-4" />
                    Datos
                  </button>
                  <button
                    onClick={() =>
                      navigate(
                        `/dashboard/student/query?instance=${instance.id}`
                      )
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors duration-200"
                  >
                    <SquarePen className="w-4 h-4" />
                    Query
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/dashboard/student/${instance.id}/logs`)
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm transition-colors duration-200"
                  >
                    <Activity className="w-4 h-4" />
                    Logs
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Play className="w-5 h-5 text-green-400" />
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
          <Link
            to="/dashboard/student/query"
            className="p-4 bg-gray-750 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-900/50 rounded-lg group-hover:bg-blue-800/50 transition-colors">
                <SquarePen className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Query Editor</h3>
                <p className="text-sm text-gray-400">Ejecuta consultas SQL</p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard/student/documentation"
            className="p-4 bg-gray-750 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-900/50 rounded-lg group-hover:bg-green-800/50 transition-colors">
                <FileText className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Documentación</h3>
                <p className="text-sm text-gray-400">Guías y referencias</p>
              </div>
            </div>
          </Link>

          <Link
            to="/dashboard/student/tutorials"
            className="p-4 bg-gray-750 hover:bg-gray-700 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-900/50 rounded-lg group-hover:bg-purple-800/50 transition-colors">
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Tutoriales</h3>
                <p className="text-sm text-gray-400">
                  Aprende a usar la plataforma
                </p>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StudentIndex;
