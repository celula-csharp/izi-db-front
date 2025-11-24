import { createBrowserRouter } from "react-router";

import Layout from "./page/_layout";

import StudentLayout from "./modules/student/layout";
import StudentIndex from "./modules/student/index";
import StudentDashboard from "./modules/student/dashboard";

import QueryEditor from "./modules/student/components/QueryEditor";
import DataExplorer from "./modules/student/dataExplorer";
import EntityList from "./modules/student/components/EntityList";
import EntityForm from "./modules/student/components/EntityForms";

const TestSchema = [
  { name: 'Nombre', type: 'string' },
  { name: 'Puerto', type: 'number' },
];

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
                onSelect={(entity) => console.log('List selected:', entity)}
            />
        ),
      },

      {
        path: "entity-form",
        element: (
            <EntityForm
                entityName="Instancia de prueba"
                schema={TestSchema}
                onSubmit={(data) => console.log('Form submitted:', data)}
                onClose={() => console.log("cerrado")}
            />
        ),
      },
    ],
  },
]);

export default Routes;