import { createBrowserRouter } from "react-router";
import Layout from "./page/_layout";

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
]);

export default Routes;
