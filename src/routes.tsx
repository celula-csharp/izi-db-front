import { createBrowserRouter, Outlet, redirect } from "react-router";

import { LoginPage } from "./auth/LoginPage";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { RegisterPage } from "./auth/RegisterPage";
import { RoleGuard } from "./auth/RoleGuard";
import { AuthLayout } from "./layout/AuthLayout";
import { MainLayout } from "./layout/MainLayout";
import EntityForm from "./modules/student/components/EntityForms";
import EntityList from "./modules/student/components/EntityList";
import QueryEditor from "./modules/student/components/QueryEditor";
import StudentDashboard from "./modules/student/dashboard";
import DataExplorer from "./modules/student/dataExplorer";
import StudentIndex from "./modules/student/index";
import NewInstance from "./modules/student/instances/new-instance";
import { AdminDashboard } from "./pages/AdminDashboard";
import { HomePage } from "./pages/HomePage";

const TestSchema = [
  { name: "Nombre", type: "string" },
  { name: "Puerto", type: "number" },
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
                element: <Outlet />,
                children: [
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
                    path: "new-instance",
                    element: <NewInstance />,
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
