import {
  ArrowLeftRight,
  Bell,
  Clock,
  Home,
  LogOut,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  PiggyBank,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import Avatar from "../atoms/Avatar";
import Logo from "../atoms/Logo";
import { getSession } from "../../utils/auth";
import { useSidebar } from "../../providers/useSidebar";

const NAVIGATION = [
  { path: "/dashboard", label: "Página Inicial", icon: Home },
  { path: "/agendamentos", label: "Agendamentos", icon: Clock },
  { path: "/dashboard-financeiro", label: "Financeiro", icon: PiggyBank },
  { path: "/transacoes", label: "Transações", icon: ArrowLeftRight },
  { path: "/produtos", label: "Produtos", icon: Package },
  { path: "/notificacoes", label: "Notificações", icon: Bell },
];

/**
 * Organism: menu lateral do shell autenticado.
 *
 * @param {object} props
 * @param {() => void} props.onRequestLogout Abre o diálogo de confirmação de saída.
 */
export default function Sidebar({ onRequestLogout }) {
  const location = useLocation();
  const { collapsed, toggle } = useSidebar();
  const { nome } = getSession();

  return (
    <>
      <div
        aria-hidden="true"
        className={`shrink-0 transition-all duration-300 ${collapsed ? "w-20" : "w-64"}`}
      />

      <aside
        className={`fixed top-0 flex h-screen flex-col border-r border-gray-800 bg-[#061639] px-3 py-10 text-white transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className="absolute top-4 right-4 cursor-pointer rounded-lg p-2 transition-all hover:bg-white/10"
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>

        <div
          className={`mb-10 flex justify-center transition-all ${
            collapsed ? "h-0 overflow-hidden opacity-0" : ""
          }`}
        >
          <Link to="/dashboard" aria-label="Ir para o dashboard">
            <Logo />
          </Link>
        </div>

        <hr className="mb-2 opacity-10" />

        {collapsed ? (
          <button
            type="button"
            onClick={onRequestLogout}
            aria-label="Sair"
            title="Sair"
            className="absolute bottom-20 left-5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg transition-all hover:bg-white/5"
          >
            <LogOut className="h-5 w-5" />
          </button>
        ) : (
          <div className="mt-5 mb-10 flex w-full items-center gap-5">
            <div className="flex-1" />

            <div className="flex flex-col items-center">
              <Avatar initials={nome?.slice(0, 1) ?? "?"} online />
              <p className="text-white">
                Olá, <b>{nome}</b>
              </p>
            </div>

            <button
              type="button"
              onClick={onRequestLogout}
              aria-label="Sair"
              title="Sair"
              className="flex h-full flex-1 cursor-pointer items-center justify-end text-gray-400 transition-colors hover:text-white"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        )}

        <nav className="flex flex-col gap-4">
          {NAVIGATION.map((item) => (
            <NavLinkItem
              key={item.path}
              item={item}
              isActive={location.pathname === item.path}
              collapsed={collapsed}
            />
          ))}
        </nav>

        <footer className="mt-auto text-center text-xs">
          {!collapsed && (
            <p className="opacity-30">DESENVOLVIDO POR: KORE © 2026</p>
          )}
        </footer>
      </aside>
    </>
  );
}

function NavLinkItem({ item, isActive, collapsed }) {
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      title={item.label}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center rounded-lg px-4 py-3 transition-all ${
        collapsed ? "justify-center" : "gap-3"
      } ${
        isActive
          ? "border-l-4 border-cyan-400 bg-cyan-500/20 text-cyan-400"
          : "hover:bg-white/5"
      }`}
    >
      <Icon />

      <span
        className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
          collapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}