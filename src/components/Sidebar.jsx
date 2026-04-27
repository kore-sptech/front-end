import {
  ArrowLeftRight,
  Bell,
  Clock,
  Home,
  Package,
  PiggyBank,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { path: "/dashboard", name: "Página Inicial", icon: <Home /> },
    { path: "/agendamentos", name: "Agendamentos", icon: <Clock /> },
    { path: "/dashboard-financeiro", name: "Financeiro", icon: <PiggyBank /> },
    { path: "/transacoes", name: "Transações", icon: <ArrowLeftRight /> },
    { path: "/estoque", name: "Estoque", icon: <Package /> },
    { path: "/notificacoes", name: "Notificações", icon: <Bell /> },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-gray-800 bg-[#061639] px-5 py-10 text-white">
      <h1 className="mb-10 text-center text-4xl font-normal">
        <b>KORE</b> <br />
        <span className="text-sm opacity-50">STUDIO MANAGEMENT</span>
      </h1>

      <div className="flex flex-col gap-4">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
              location.pathname === link.path
                ? "border-l-4 border-cyan-400 bg-cyan-500/20 text-cyan-400"
                : "hover:bg-white/5"
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>

      <footer className="mt-auto text-center text-xs opacity-30">
        DESENVOLVIDO POR: KORE © 2026
      </footer>
    </aside>
  );
}
