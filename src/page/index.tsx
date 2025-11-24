import Button from "@/components/ui/button";
import { Outlet } from "react-router";

export default function Index() {
  return (
    <div>
      <Button mensaje="INICIO">Inicio</Button>
      <Button>Ajustes</Button>
      <Button>Hola</Button>
      <Button>Sarita</Button>
      <Outlet />
    </div>
  );
}
