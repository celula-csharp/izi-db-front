import { jsx as _jsx } from "react/jsx-runtime";
import { createBrowserRouter, redirect } from "react-router";
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
        element: _jsx(AuthLayout, {}),
        children: [
            {
                index: true,
                element: _jsx(HomePage, {}),
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
                        element: _jsx(LoginPage, {}),
                    },
                    {
                        path: "register",
                        element: _jsx(RegisterPage, {}),
                    },
                ],
            },
        ],
    },
    {
        path: "",
        element: _jsx(ProtectedRoute, {}),
        children: [
            {
                path: "dashboard",
                element: _jsx(MainLayout, {}),
                children: [
                    {
                        path: "admin",
                        element: _jsx(RoleGuard, { roles: ["ADMIN"] }),
                        children: [
                            {
                                index: true,
                                element: _jsx(AdminDashboard, {}),
                            },
                        ],
                    },
                    {
                        path: "student",
                        element: _jsx(RoleGuard, { roles: ["STUDENT"] }),
                        children: [
                            {
                                element: _jsx(StudentLayout, {}),
                                children: [
                                    {
                                        index: true,
                                        element: _jsx(StudentIndex, {}),
                                    },
                                    {
                                        path: "dashboard",
                                        element: _jsx(StudentDashboard, {}),
                                    },
                                    {
                                        path: "query",
                                        element: _jsx(QueryEditor, {}),
                                    },
                                    {
                                        path: "data",
                                        element: _jsx(DataExplorer, {}),
                                    },
                                    {
                                        path: ":id/data",
                                        element: _jsx(DataExplorer, {}),
                                    },
                                    {
                                        path: ":id/logs",
                                        element: _jsx("div", { children: "Logs (coming soon)" }),
                                    },
                                    {
                                        path: "entity-list",
                                        element: (_jsx(EntityList, { entities: [], onSelect: (entity) => console.log("List selected:", entity) })),
                                    },
                                    {
                                        path: "entity-form",
                                        element: (_jsx(EntityForm, { entityName: "Instancia de prueba", schema: TestSchema, onSubmit: (data) => console.log("Form submitted:", data), onClose: () => console.log("cerrado") })),
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
