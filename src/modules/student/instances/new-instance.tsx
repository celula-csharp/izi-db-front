import { studentService } from "@/api/studentService";
import { useAuth } from "@/auth/useAuth";
import { ArrowLeft, Database } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewInstance() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("El nombre es requerido");
      return;
    }

    if (!user?.id) {
      setError("Usuario no autenticado");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await studentService.createInstance(
        formData.name.trim(),
        formData.description.trim(),
        user.id
      );

      navigate("/dashboard/student");
    } catch (err: any) {
      console.error("Error creating instance:", err);
      setError(
        err.response?.data?.message ||
          "Error al crear la instancia. Por favor, intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-400 hover:text-gray-200 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-900/50 rounded-lg">
              <Database className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Nueva Instancia de Base de Datos
              </h1>
              <p className="text-gray-400 mt-1">
                Crea una nueva instancia para trabajar con diferentes motores de
                base de datos
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Nombre */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Nombre de la instancia *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Mi Base de Datos Principal"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                disabled={isLoading}
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.name.length}/100 caracteres
              </p>
            </div>

            {/* Descripción */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe el propósito de esta instancia de base de datos..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:opacity-50"
                disabled={isLoading}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.description.length}/500 caracteres
              </p>
            </div>

            {/* Información del propietario */}
            <div className="bg-gray-700/50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-300 mb-2">
                Información del propietario
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Usuario:</span>
                  <p className="font-medium text-white">
                    {user?.name || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <p className="font-medium text-white">
                    {user?.email || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">Rol:</span>
                  <p className="font-medium text-white">
                    {user?.role || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-gray-400">ID:</span>
                  <p className="font-medium text-white text-xs truncate">
                    {user?.id || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creando...
                  </span>
                ) : (
                  "Crear Instancia"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Información adicional */}
        <div className="mt-6 bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-300 mb-2">
            ¿Qué es una instancia?
          </h3>
          <p className="text-sm text-blue-200">
            Una instancia es un entorno aislado donde puedes trabajar con
            diferentes motores de base de datos. Cada instancia tiene sus
            propias tablas, colecciones y datos independientes.
          </p>
        </div>
      </div>
    </div>
  );
}
