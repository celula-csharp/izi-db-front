import HeaderDashboard from "@/components/block/header-dashboard";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div>
      <HeaderDashboard />
      <Outlet />
    </div>
  );
}
