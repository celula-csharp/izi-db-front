import { createBrowserRouter } from "react-router";
import Layout from "./page/_layout";

// Importar módulo Student
import StudentLayout from "./modules/student/layout";
import StudentIndex from "./modules/student/index";
import StudentDashboard from "./modules/student/dashboard";

const Routes = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <div>HOLA</div>,
      },
    ],
  },

  // --- RUTAS DEL MÓDULO STUDENT ---
  {
    path: "/student",
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: <StudentIndex />,
      },
      {
        path: "dashboard",
        element: <StudentDashboard />,
      },
    ],
  },
]);

export default Routes;
