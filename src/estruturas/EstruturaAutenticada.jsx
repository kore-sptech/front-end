import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

export default function EstruturaAutenticada() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#000C24]">
      <Sidebar />
      <main className="min-w-0 grow overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
