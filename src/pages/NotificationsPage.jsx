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
   {
    id: 6,
    tipo: "CRITICO",
    titulo: "Estoque Crítico: Tinta Branca Premium",
    descricao: "O estoque de tinta Branca Premium (120ml) está zerado. Reposição urgente necessária.",
    tempo: "Há 10 min",
  },
  {
    id: 7,
    tipo: "ATENCAO",
    titulo: "Validade Próxima: Película Protetora",
    descricao: "O lote #P2241 de película protetora vence em 10 dias. Verifique o estoque.",
    tempo: "Há 3 horas",
  },
  {
    id: 8,
    tipo: "INFORMATIVO",
    titulo: "Próxima Sessão: João Mendes",
    descricao: "Sessão de sombreado nas costas agendada para as 16:30.",
    tempo: "Há 30 min",
    hasDetails: true,
  },
  {
    id: 9,
    tipo: "ATENCAO",
    titulo: "Manutenção Agendada: Máquina Rotativa",
    descricao: "Manutenção preventiva da máquina rotativa #02 agendada para sexta-feira.",
    tempo: "Há 5 horas",
  },
  {
    id: 10,
    tipo: "CRITICO",
    titulo: "Estoque Crítico: Agulhas Magnum 9",
    descricao: "Restam apenas 3 pacotes de agulhas Magnum 9. Estoque abaixo do mínimo.",
    tempo: "Há 15 min",
  },
  {
    id: 11,
    tipo: "INFORMATIVO",
    titulo: "Próxima Sessão: Fernanda Lima",
    descricao: "Sessão de retoque de aquarela agendada para as 11:00.",
    tempo: "Há 20 min",
    hasDetails: true,
  },
  {
    id: 12,
    tipo: "ATENCAO",
    titulo: "Validade Próxima: Tinta Vermelha Sangue",
    descricao: "O lote #T5512 vence em 7 dias. Utilize com prioridade ou descarte adequadamente.",
    tempo: "Há 4 horas",
  },
  {
    id: 13,
    tipo: "CRITICO",
    titulo: "Estoque Crítico: Luvas P",
    descricao: "Estoque de luvas tamanho P atingiu nível crítico. Apenas 1 caixa disponível.",
    tempo: "Há 25 min",
  },
  {
    id: 14,
    tipo: "INFORMATIVO",
    titulo: "Próxima Sessão: Carlos Drummond",
    descricao: "Sessão de blackwork no antebraço agendada para as 15:00.",
    tempo: "Há 55 min",
    hasDetails: true,
  },
  {
    id: 15,
    tipo: "ATENCAO",
    titulo: "Validade Próxima: Creme Cicatrizante",
    descricao: "O lote #C9901 de creme cicatrizante vence em 20 dias.",
    tempo: "Há 6 horas",
  },
  {
    id: 16,
    tipo: "CRITICO",
    titulo: "Estoque Crítico: Papel Transfer",
    descricao: "Restam apenas 5 folhas de papel transfer. Reposição urgente.",
    tempo: "Há 8 min",
  },
  {
    id: 17,
    tipo: "INFORMATIVO",
    titulo: "Próxima Sessão: Marina Souza",
    descricao: "Sessão de geometria no pescoço agendada para as 13:30.",
    tempo: "Há 1 hora",
    hasDetails: true,
  },
  {
    id: 18,
    tipo: "ATENCAO",
    titulo: "Validade Próxima: Álcool Isopropílico",
    descricao: "O lote #A3312 vence em 12 dias. Priorize o uso.",
    tempo: "Há 7 horas",
  },
  {
    id: 29,
    tipo: "CRITICO",
    titulo: "Estoque Crítico: Tinta Azul Oceano",
    descricao: "Tinta Azul Oceano (60ml) com apenas 1 unidade restante.",
    tempo: "Há 18 min",
  },
];

const ITEMS_PER_PAGE = 5;

export default function NotificationsPage() {
  const [filtroAtivo, setFiltroAtivo] = useState("TODAS");
  const [paginaAtual, setPaginaAtual] = useState(1);

  const notificationsFiltradas = initialNotifications.filter((n) => {
    if (filtroAtivo === "TODAS") return true;
    if (filtroAtivo === "ESTOQUE") return n.tipo === "CRITICO";
    if (filtroAtivo === "SESSÕES") return n.tipo === "INFORMATIVO";
    if (filtroAtivo === "VALIDADE") return n.tipo === "ATENCAO";
    return true;
  });

  const critico = notificationsFiltradas.filter(
  (n) => n.tipo === "CRITICO"
).length;

const atencao = notificationsFiltradas.filter(
  (n) => n.tipo === "ATENCAO"
).length;

const informativo = notificationsFiltradas.filter(
  (n) => n.tipo === "INFORMATIVO"
).length;

  const totalNotifications = notificationsFiltradas.length;
  const totalPages = Math.ceil(totalNotifications / ITEMS_PER_PAGE);

  const notificacoesDaPagina = notificationsFiltradas.slice(
    (paginaAtual - 1) * ITEMS_PER_PAGE,
    paginaAtual * ITEMS_PER_PAGE
  );

  const inicioExibicao = totalNotifications === 0 ? 0 : (paginaAtual - 1) * ITEMS_PER_PAGE + 1;
  const fimExibicao = Math.min(paginaAtual * ITEMS_PER_PAGE, totalNotifications);

  const irParaPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPages) {
      setPaginaAtual(pagina);
    }
  };

  const getPaginasVisiveis = () => {
    const paginas = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) paginas.push(i);
    } else {
      paginas.push(1);
      if (paginaAtual > 3) paginas.push("...");
      for (let i = Math.max(2, paginaAtual - 1); i <= Math.min(totalPages - 1, paginaAtual + 1); i++) {
        paginas.push(i);
      }
      if (paginaAtual < totalPages - 2) paginas.push("...");
      paginas.push(totalPages);
    }
    return paginas;
  };

  return (
    <div className="flex min-h-screen bg-[#000C24] text-[#DAE2FF]">
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col justify-between">
        <div>
          {/* Header com Filtros superiores */}
          <header className="mb-8 flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold mr-15 text-[#DAE2FF]">NOTIFICAÇÕES</h1>

              <span className="block h-1 w-12 rounded-3xl bg-[#48DCFC]" />
            </div>

            {/* Abas de Filtro*/}
            <div className="flex gap-2 bg-[#061639]/40 p-1 rounded-lg border border-gray-800">
              {["TODAS", "ESTOQUE", "SESSÕES", "VALIDADE"].map((aba) => (
                <button
                  key={aba}
                  onClick={() => { setFiltroAtivo(aba); setPaginaAtual(1);}}
                  className={`cursor-pointer rounded-md px-4 py-1.5 text-xs border border-transparent font-bold tracking-wider transition-all ${
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
              {notificacoesDaPagina.map((alert) => (
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
                  <span className="text-xl font-black text-white">{critico}</span>
                </div>

                {/* Indicador Atenção */}
                <div className="flex items-center justify-between rounded-xl bg-[#021134] px-5 py-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FB923C]">Atenção</span>
                  <span className="text-xl font-black text-white">{atencao}</span>
                </div>

                {/* Indicador Informativos */}
                <div className="flex items-center justify-between rounded-xl bg-[#021134] px-5 py-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#22D3EE]">Informativos</span>
                  <span className="text-xl font-black text-white">{informativo}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer da tabela / Paginação inferior */}
        <footer className="mt-10 flex items-center justify-between border-t border-gray-800/50 pt-6 text-xs text-gray-500 font-semibold uppercase tracking-wider">
          <div>Exibindo {inicioExibicao} - {fimExibicao} de {totalNotifications} notificações no sistema</div>

          {/*Carolzinha adicionar a paginação aqui*/}
          <div className="flex items-center gap-1">
            <button
              onClick={() => irParaPagina(paginaAtual - 1)}
              disabled={paginaAtual === 1}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-700 text-gray-400 transition-all hover:border-[#22D3EE]/50 hover:text-[#22D3EE] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={14} />
            </button>

            {getPaginasVisiveis().map((pagina, index) =>
              pagina === "..." ? (
                <span key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={pagina}
                  onClick={() => irParaPagina(pagina)}
                  className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold tracking-wider transition-all ${
                    paginaAtual === pagina
                      ? "bg-[#22D3EE] text-[#000C24] shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                      : "border border-gray-700 text-gray-400 hover:border-[#22D3EE]/50 hover:text-[#22D3EE]"
                  }`}
                >
                  {pagina}
                </button>
              )
            )}

            <button
              onClick={() => irParaPagina(paginaAtual + 1)}
              disabled={paginaAtual === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-700 text-gray-400 transition-all hover:border-[#22D3EE]/50 hover:text-[#22D3EE] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={14} />
            </button>
          </div>

        </footer>
      </main>
    </div>
  );
}
