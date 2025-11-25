import { createBrowserRouter, redirect, Navigate } from "react-router";


import StudentDashboard from "./modules/student/dashboard";
import StudentIndex from "./modules/student/index";
import StudentLayout from "./modules/student/layout";

import { LoginPage } from "./auth/LoginPage";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { RegisterPage } from "./auth/RegisterPage";
import { RoleGuard } from "./auth/RoleGuard";
import { AuthLayout } from "./layout/AuthLayout";
import { MainLayout } from "./layout/MainLayout";
import EntityForm from "./modules/student/components/EntityForms";
import EntityList from "./modules/student/components/EntityList";
import QueryEditor from "./modules/student/components/QueryEditor";
import DataExplorer from "./modules/student/dataExplorer";
import { AdminDashboard } from "./pages/AdminDashboard";
import { HomePage } from "./pages/HomePage";

const TestSchema = [
  { name: 'Nombre', type: 'string' },
  { name: 'Puerto', type: 'number' },
];

const Routes = createBrowserRouter([
  {
    path: "",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "auth",
        children: [
          {
            index: true,
            loader: () => redirect("/auth/login"),
          },
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "register",
            element: <RegisterPage />,
          },
        ],
      },
    ],
  },
  {
    path: "", // Ruta de Nivel Raíz para usuarios autenticados
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        loader: () => redirect("/dashboard"),
      },

      {
        path: "dashboard",
        element: <MainLayout />,
        children: [
          {
            path: "admin",
            element: <RoleGuard roles={["ADMIN"]} />,
            children: [
              {
                index: true,
                element: <AdminDashboard />,
              },
            ],
          },
          {
            path: "student",
            element: <RoleGuard roles={["STUDENT"]} />,
            children: [
              {
                element: <StudentLayout />,
                children: [
                  // ✅ REDIRECCIÓN DE INDEX (Fuerza a 'dashboard' para /dashboard/student)
                  {
                    index: true,
                    element: <Navigate to="dashboard" replace />,
                  },

                  {
                    path: "index",
                    element: <StudentIndex />,
                  },

                  {
                    path: "dashboard",
                    element: <StudentDashboard />,
                  },

                  {
                    path: "query",
                    element: <QueryEditor />,
                  },

                  {
                    path: "data",
                    element: <DataExplorer />,
                  },

                  {
                    path: ":id/data",
                    element: <DataExplorer />,
                  },

                  {
                    path: ":id/logs",
                    element: <div>Logs (coming soon)</div>,
                  },

                  {
                    path: "entity-list",
                    element: (
                        <EntityList
                            entities={[]}
                            onSelect={(entity) =>
                                console.log("List selected:", entity)
                            }
                        />
                    ),
                  },

                  {
                    path: "entity-form",
                    element: (
                        <EntityForm
                            entityName="Instancia de prueba"
                            schema={TestSchema}
                            onSubmit={(data) =>
                                console.log("Form submitted:", data)
                            }
                            onClose={() => console.log("cerrado")}
                        />
                    ),
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default Routes;