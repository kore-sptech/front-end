import { useState } from "react";
import Sidebar from "../components/Sidebar";
import NotificationCard from "../components/CardNotificacoes";
import { ChevronLeft, ChevronRight } from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    tipo: "CRITICO",
    titulo: "Estoque Crítico: Tinta Dynamic Black",
    descricao: "O estoque de tinta Dynamic Black (240ml) atingiu o nível mínimo. Restam apenas 2 unidades.",
    tempo: "Há 5 min",
  },
  {
    id: 2,
    tipo: "ATENCAO",
    titulo: "Validade Próxima: Agulhas RL-03",
    descricao: "O lote #K8829 de agulhas RL-03 vence em 15 dias. Priorize o uso ou remova do estoque principal.",
    tempo: "Há 2 horas",
  },
  {
    id: 3,
    tipo: "INFORMATIVO",
    titulo: "Próxima Sessão: Marcelo Oliveira",
    descricao: "Sessão de fechamento de braço agendada para as 14:00.",
    tempo: "Há 42 min",
    hasDetails: true,
  },
  {
    id: 4,
    tipo: "ATENCAO",
    titulo: "Validade Próxima: Agulhas RL-03",
    descricao: "O lote #K8829 de agulhas RL-03 vence em 15 dias. Priorize o uso ou remova do estoque principal.",
    tempo: "Há 2 horas",
  },
  {
    id: 5,
    tipo: "CRITICO",
    titulo: "Estoque Crítico: Tinta Dynamic Black",
    descricao: "O estoque de tinta Dynamic Black (240ml) atingiu o nível mínimo. Restam apenas 2 unidades.",
    tempo: "Há 5 min",
  },
];

export default function NotificationsPage() {
  const [filtroAtivo, setFiltroAtivo] = useState("TODAS");

  const notificationsFiltradas = initialNotifications.filter((n) => {
    if (filtroAtivo === "TODAS") return true;
    if (filtroAtivo === "ESTOQUE") return n.tipo === "CRITICO"; 
    if (filtroAtivo === "SESSÕES") return n.tipo === "INFORMATIVO";
    if (filtroAtivo === "VALIDADE") return n.tipo === "ATENCAO";
    return true;
  });

  return (
    <div className="flex min-h-screen bg-[#000C24] text-[#DAE2FF]">
      <Sidebar />

      <main className="flex-1 p-10 flex flex-col justify-between">
        <div>
          {/* Header com Filtros superiores */}
          <header className="mb-8 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-4xl font-bold tracking-wide text-white uppercase">Notificações</h1>
              <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">
                Monitoramento de Precisão Clínica
              </p>
            </div>

            {/* Abas de Filtro*/}
            <div className="flex gap-2 bg-[#061639]/40 p-1 rounded-lg border border-gray-800">
              {["TODAS", "ESTOQUE", "SESSÕES", "VALIDADE"].map((aba) => (
                <button
                  key={aba}
                  onClick={() => setFiltroAtivo(aba)}
                  className={`cursor-pointer rounded-md px-4 py-1.5 text-xs font-bold tracking-wider transition-all ${
                    filtroAtivo === aba
                      ? "bg-[#1E3A8A]/50 text-[#22D3EE] border border-[#22D3EE]/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {aba}
                </button>
              ))}
            </div>
          </header>

          {/* Grid principal Listagem e resumo */}
          <div className="grid grid-cols-12 gap-8 items-start">
            
            {/* Coluna Esquerda: Lista de Alertas */}
            <div className="col-span-8 flex flex-col gap-4">
              {notificationsFiltradas.map((alert) => (
                <NotificationCard key={alert.id} alert={alert} />
              ))}
            </div>

            {/* Coluna Direita: Resumo de alertas */}
            <div className="col-span-4 rounded-2xl border border-gray-800 bg-[#061639] p-6">
              <h3 className="mb-6 text-base font-bold text-white tracking-wide">Resumo de Alertas</h3>
              
              <div className="space-y-4">
                {/* Indicador Críticos */}
                <div className="flex items-center justify-between rounded-xl bg-[#021134] px-5 py-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#F87171]">Críticos</span>
                  <span className="text-xl font-black text-white">02</span>
                </div>

                {/* Indicador Atenção */}
                <div className="flex items-center justify-between rounded-xl bg-[#021134] px-5 py-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FB923C]">Atenção</span>
                  <span className="text-xl font-black text-white">05</span>
                </div>

                {/* Indicador Informativos */}
                <div className="flex items-center justify-between rounded-xl bg-[#021134] px-5 py-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">Informativos</span>
                  <span className="text-xl font-black text-white">12</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer da tabela / Paginação inferior */}
        <footer className="mt-10 flex items-center justify-between border-t border-gray-800/50 pt-6 text-xs text-gray-500 font-semibold uppercase tracking-wider">
          <div>Exibindo 1 - 5 de 50 notificações no sistema</div>
          

              {/*Carolzinha adicionar a paginação aqui*/}

        </footer>
      </main>
    </div>
  );
}