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
  UserRound,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { useNavigate } from "react-router-dom";

import { Logo } from "./Logo";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { collapsed, setCollapsed } = useSidebar();

  const links = [
    { path: "/dashboard", name: "Página Inicial", icon: <Home /> },
    { path: "/agendamentos", name: "Agendamentos", icon: <Clock /> },
    { path: "/dashboard-financeiro", name: "Financeiro", icon: <PiggyBank /> },
    { path: "/transacoes", name: "Transações", icon: <ArrowLeftRight /> },
    { path: "/produtos", name: "Produtos", icon: <Package /> },
    { path: "/notificacoes", name: "Notificações", icon: <Bell /> },
  ];

  function deslogar() {

    localStorage.clear();
    navigate("/")

  }

  return (
    <>
      <div className={`flex h-screen shrink-0 transition-all duration-300 ${collapsed ? "w-20" : "w-64"
        }`}
      />

      <aside className={`fixed top-0 flex h-screen flex-col border-r border-gray-800 bg-[#061639] px-3 py-10 text-white transition-all duration-300 ${collapsed ? "w-20" : "w-64"
        }`}
      >

        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute top-4 right-4 rounded-lg transition-all p-2 hover:bg-white/10"
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>

        <h1 className={`mb-10 flex justify-center transition-all ${collapsed ? "opacity-0 h-0 overflow-hidden" : ""
          }`}
        >
          <Logo className="h-25 w-auto object-contain" />
        </h1>

        <hr className="opacity-10 mb-2" />

        {!collapsed ? (

          <div className="mb-10 mt-5">
            <div className="flex items-center flex-col justify-center">
              <UserRound className="rounded-full p-2 border w-15 h-15 m-3 opacity-60"></UserRound>
              <p className="text-white textarea-md">Olá, <b>{"teste"}</b></p>

              <LogOut className="cursor-pointer absolute w-5 h-5 right-15 top-73" onClick={() => document.getElementById(`my_modal`).showModal()}></LogOut>
            </div>

          </div>
        ) : (<LogOut className="cursor-pointer absolute w-11 h-11 left-5 bottom-20 px-3 py-2 hover:bg-white/5 rounded-lg transition-all" onClick={() => document.getElementById(`my_modal`).showModal()}></LogOut>)}

        <div className="flex flex-col gap-4">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className={`flex items-center rounded-lg px-4 py-3 transition-all ${collapsed ? "justify-center" : "gap-3"
                } ${location.pathname === link.path
                  ? "border-l-4 border-cyan-400 bg-cyan-500/20 text-cyan-400"
                  : "hover:bg-white/5"
                }`}
            >
              {link.icon}

              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${collapsed
                  ? "max-w-0 opacity-0"
                  : "max-w-[200px] opacity-100"
                  }`}
              >
                {link.name}
              </span>
            </Link>
          ))}
        </div>

        <footer className="mt-auto text-center text-xs opacity-100">
          {!collapsed && (
            <div>
              {/* <div className="mb-10">
                <div className="flex items-center flex-col justify-center">
                  <UserRound className="rounded-full p-2 border w-15 h-15 m-3 opacity-60"></UserRound>
                  <p className="text-white textarea-md">Olá, <b>{"teste"}</b></p>

                  <LogOut className="cursor-pointer absolute w-5 h-5 right-15 bottom-24"></LogOut>
                </div>

              </div> */}
              <p className="opacity-30">DESENVOLVIDO POR: KORE © 2026</p>
            </div>
          )}
        </footer>
        {/* <footer className="mt-auto text-center text-xs opacity-100">
          {!collapsed && (
            <div>
              <div className="flex items-center mb-10 justify-between">
                <div className="flex items-center">
                  <UserRound className="rounded-full p-2 border w-10 h-10 m-3 opacity-60"></UserRound>
                  <p className="text-white textarea-md">Olá, <b>{"teste"}</b></p>
                </div>
                <div>
                  <LogOut className="cursor-pointer"></LogOut>
                </div>
              </div>
              <p className="opacity-30">DESENVOLVIDO POR: KORE © 2026</p>
            </div>
          )}
        </footer> */}
      </aside>

      <dialog id={`my_modal`} className="modal">
        <div className="p-5 rounded-lg bg-[#0A1F4B] text-center">
          <h2 className="text-lg font-bold">Sair?</h2>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}

            <div className="flex gap-4">
              <button
                onClick={(ev) => {
                  ev.preventDefault();
                  document.getElementById(`my_modal`).close();
                }}
                className="flex cursor-pointer gap-2 rounded-xl border border-[#48DCFC] px-6 py-2.5 font-normal text-[#48DCFC]"
              >
                Cancelar
              </button>

              <button
                className="flex cursor-pointer gap-2 rounded-xl bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] px-6 py-2.5 font-normal text-[#003640] opacity-65 shadow-xl transition-all hover:opacity-100 hover:shadow-cyan-500/20"
                onClick={(ev) => {
                  ev.preventDefault();
                  deslogar();
                }}
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
