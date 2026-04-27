import {
  Calendar,
  Download,
  Filter,
  MoreVertical,
  Paintbrush,
  Plus,
  Search,
  ShoppingCart,
  User,
  Zap,
} from "lucide-react";

import ModalNovaTransacao from "../components/ModalNovaTransacao";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

// Dados fictícios para a tabela
const transacoes = [
  {
    id: 1,
    nome: "Pigmentos Dynamic Triple Black",
    categoria: "ESTOQUE / SUPRIMENTOS",
    valor: -450.0,
    tipo: "SAÍDA",
    data: "12 Out, 2023",
    icon: <Paintbrush size={20} />,
  },
  {
    id: 2,
    nome: "Tatuagem Realista (Sessão 2) - Marcos V.",
    categoria: "SERVIÇO / TATUAGEM",
    valor: 1200.0,
    tipo: "ENTRADA",
    data: "12 Out, 2023",
    icon: <User size={20} />,
  },
  {
    id: 3,
    nome: "Conta de Luz - Unidade Central",
    categoria: "FIXO / OPERACIONAL",
    valor: -380.45,
    tipo: "SAÍDA",
    data: "11 Out, 2023",
    icon: <Zap size={20} />,
  },
  {
    id: 4,
    nome: "Venda de Joia Piercing Titânio",
    categoria: "VENDA / PRODUTO",
    valor: 220.0,
    tipo: "ENTRADA",
    data: "11 Out, 2023",
    icon: <ShoppingCart size={20} />,
  },
  {
    id: 5,
    nome: "Venda de Joia Piercing Titânio",
    categoria: "VENDA / PRODUTO",
    valor: 220.0,
    tipo: "ENTRADA",
    data: "11 Out, 2023",
    icon: <ShoppingCart size={20} />,
  },
];

export default function TransacoesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#000C24] text-white">
      <Sidebar />

      <main className="flex-1 p-10">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Transações financeiras</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-2 font-bold text-black transition-all hover:bg-cyan-300"
          >
            <Plus size={20} /> Nova Transação
          </button>
        </header>

        {/* KPIs */}
        <div className="mb-10 grid grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-800 bg-[#061639] p-6">
            <p className="mb-2 text-xs font-bold text-cyan-400 uppercase">
              Receita Mensal
            </p>
            <h2 className="text-3xl font-bold">R$ 42.890,00</h2>
            <p className="mt-2 text-xs text-gray-500">
              +12.4% em relação ao mês passado
            </p>
          </div>
          <div className="rounded-2xl border border-gray-800 bg-[#061639] p-6">
            <p className="mb-2 text-xs font-bold text-red-400 uppercase">
              Despesas Mensais
            </p>
            <h2 className="text-3xl font-bold">R$ 12.430,50</h2>
            <p className="mt-2 text-xs text-gray-500">
              -4.2% em relação ao mês passado
            </p>
          </div>
          <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#061639] to-cyan-900/30 p-6 shadow-lg">
            <p className="mb-2 text-xs font-bold text-gray-300 uppercase">
              Saldo em Conta
            </p>
            <h2 className="text-3xl font-bold">R$ 84.120,45</h2>
            <button className="mt-2 text-xs text-cyan-400 hover:underline">
              VER EXTRATO DETALHADO →
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex gap-4">
          <div className="flex rounded-lg border border-gray-800 bg-[#061639] p-1">
            <button className="flex items-center gap-2 rounded-md bg-[#1e293b] px-4 py-2 text-sm">
              <Calendar size={16} /> Data
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400">
              Status: Todos
            </button>
          </div>

          <div className="relative flex-1">
            <Search
              className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Nome, descrição ou categoria..."
              className="w-full rounded-full border border-gray-800 bg-[#061639] py-3 pr-4 pl-12 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <button className="rounded-lg border border-gray-800 bg-[#061639] p-3 text-gray-400 hover:text-white">
            <Filter size={20} />
          </button>
          <button className="rounded-lg border border-gray-800 bg-[#061639] p-3 text-gray-400 hover:text-white">
            <Download size={20} />
          </button>
        </div>

        {/* Tabela de Transações */}
        <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#061639]/50">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
                <th className="px-8 py-5 font-semibold">Nome</th>
                <th className="px-8 py-5 font-semibold">Valor</th>
                <th className="px-8 py-5 text-center font-semibold">Tipo</th>
                <th className="px-8 py-5 font-semibold">Data</th>
                <th className="px-8 py-5 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {transacoes.map((item) => (
                <tr
                  key={item.id}
                  className="group transition-colors hover:bg-white/5"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-cyan-500/10 p-3 text-cyan-400">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{item.nome}</p>
                        <p className="text-[10px] font-bold text-gray-500">
                          {item.categoria}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td
                    className={`px-8 py-5 font-bold ${item.valor > 0 ? "text-cyan-400" : "text-red-400"}`}
                  >
                    {item.valor > 0
                      ? `+ R$ ${item.valor.toLocaleString()}`
                      : `- R$ ${Math.abs(item.valor).toLocaleString()}`}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${item.tipo === "ENTRADA" ? "bg-cyan-400/20 text-cyan-400" : "bg-red-400/20 text-red-400"}`}
                    >
                      {item.tipo}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-400">
                    {item.data}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-gray-500 hover:text-white">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginação */}
          <div className="flex items-center justify-between border-t border-gray-800 p-6 text-xs text-gray-500">
            <p>Exibindo 1 - 5 de 128 transações</p>
            <div className="flex gap-2">
              <button className="flex h-8 w-8 items-center justify-center rounded bg-cyan-400 font-bold text-black">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/10">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/10">
                3
              </button>
              <span className="flex items-center px-1">...</span>
              <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/10">
                12
              </button>
            </div>
          </div>
        </div>
      </main>
      <ModalNovaTransacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
