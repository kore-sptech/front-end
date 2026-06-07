import { useState } from "react";
import {
  ArrowLeftRight,
  Bell,
  Clock,
  Home,
  Package,
  PiggyBank,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";

import { Logo } from "./Logo";

export default function Sidebar() {
  const location = useLocation();

  const { collapsed, setCollapsed } = useSidebar();

  const links = [
    { path: "/dashboard", name: "Página Inicial", icon: <Home /> },
    { path: "/agendamentos", name: "Agendamentos", icon: <Clock /> },
    { path: "/dashboard-financeiro", name: "Financeiro", icon: <PiggyBank /> },
    { path: "/transacoes", name: "Transações", icon: <ArrowLeftRight /> },
    { path: "/produtos", name: "Produtos", icon: <Package /> },
    { path: "/notificacoes", name: "Notificações", icon: <Bell /> },
  ];

  return (
    <>
      <div className={`flex h-screen shrink-0 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      />

      <aside className={`fixed top-0 flex h-screen flex-col border-r border-gray-800 bg-[#061639] px-3 py-10 text-white transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >

      <button onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 right-4 rounded-lg p-2 hover:bg-white/10"
      >
        {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
      </button>

        <h1 className={`mb-10 flex justify-center transition-all ${
            collapsed ? "opacity-0 h-0 overflow-hidden" : ""
          }`}
        >
          <Logo className="h-25 w-auto object-contain" />
        </h1>

        <div className="flex flex-col gap-4">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`flex items-center rounded-lg px-4 py-3 transition-all ${
                collapsed ? "justify-center" : "gap-3"
              } ${
                location.pathname === link.path
                  ? "border-l-4 border-cyan-400 bg-cyan-500/20 text-cyan-400"
                  : "hover:bg-white/5"
              }`}
            >
              {link.icon}

              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                  collapsed
                    ? "max-w-0 opacity-0"
                    : "max-w-[200px] opacity-100"
                }`}
              >
                {link.name}
              </span>
            </Link>
          ))}
        </div>

        <footer className="mt-auto text-center text-xs opacity-30">
          {!collapsed && (<p >DESENVOLVIDO POR: KORE © 2026</p>)}
        </footer>
      </aside>
    </>
  );
}
