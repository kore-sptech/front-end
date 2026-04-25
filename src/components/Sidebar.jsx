import { ArrowLeftRight, Bell, Clock, Home, Package, PiggyBank } from "lucide-react";
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
        <aside className="w-64 bg-[#061639] px-5 py-10 text-white border-r border-gray-800 flex flex-col h-screen sticky top-0">
            <h1 className="text-4xl font-normal text-center mb-10">
                <b>KORE</b> <br />
                <span className="text-sm opacity-50">STUDIO MANAGEMENT</span>
            </h1>

            <div className="flex flex-col gap-4">
                {links.map((link, index) => (
                    <Link
                        key={index}
                        to={link.path}
                        className={`flex gap-3 items-center px-4 py-3 rounded-lg transition-all ${location.pathname === link.path ? "bg-cyan-500/20 text-cyan-400 border-l-4 border-cyan-400" : "hover:bg-white/5"
                            }`}
                    >
                        {link.icon}
                        {link.name}
                    </Link>
                ))}
            </div>

            <footer className="mt-auto text-center opacity-30 text-xs">
                DESENVOLVIDO POR: KORE © 2026
            </footer>
        </aside>
    );
}