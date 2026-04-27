import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Plus, TrendingUp } from "lucide-react";

import ModalNovaTransacao from "../components/ModalNovaTransacao";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

const dataPizza = [
  { name: "Materiais", value: 65, color: "#22d3ee" },
  { name: "Insumos", value: 25, color: "#334155" },
  { name: "Outros", value: 10, color: "#1e293b" },
];

export default function DashboardFinanceiraPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#000C24] text-white">
      <Sidebar />

      <main className="flex-1 p-10">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Relatório Financeiro</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-2 font-bold text-black transition-all hover:bg-cyan-300"
          >
            <Plus size={20} /> Nova Transação
          </button>
        </header>

        {/* Grid de Cards */}
        <div className="grid grid-cols-12 gap-6">
          {/* Card Principal - Saldo */}
          <div className="relative col-span-8 overflow-hidden rounded-2xl border border-gray-800 bg-[#061639] p-8">
            <div className="absolute top-0 left-0 h-full w-1 bg-cyan-400"></div>
            <p className="mb-2 text-sm font-semibold text-gray-400 uppercase">
              Saldo do Mês
            </p>
            <h2 className="mb-4 text-6xl font-bold">R$ 2.100,00</h2>
            <p className="flex items-center gap-2 text-sm text-cyan-400">
              <TrendingUp size={16} /> +12% em relação ao mês anterior
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 uppercase">
                  Faturamento Bruto Estimado
                </p>
                <p className="text-2xl font-bold">R$ 5.420,00</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">
                  Previsão Próximo Mês
                </p>
                <p className="text-2xl font-bold text-gray-300">R$ 6.100,00</p>
              </div>
            </div>
          </div>

          {/* KPIs de entrada e saída */}
          <div className="col-span-4 flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-2xl border border-gray-800 bg-[#061639] p-6">
              <div>
                <p className="text-xs text-gray-400 uppercase">Entradas</p>
                <p className="text-2xl font-bold">R$ 3.000,00</p>
              </div>
              <div className="rounded-full bg-cyan-500/10 p-3 text-cyan-400">
                <TrendingUp />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-gray-800 bg-[#061639] p-6">
              <div>
                <p className="text-xs text-gray-400 uppercase">Saídas</p>
                <p className="text-opacity-80 text-2xl font-bold text-red-400">
                  R$ 900,00
                </p>
              </div>
            </div>
          </div>

          {/* Gráfico de Gastos */}
          <div className="col-span-4 rounded-2xl border border-gray-800 bg-[#061639] p-8">
            <h3 className="mb-6 text-xl font-bold">Gastos por categoria</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataPizza}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataPizza.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legenda */}
            <div className="mt-4 space-y-2">
              {dataPizza.map((item) => (
                <div key={item.name} className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    {item.name}
                  </span>
                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transações Recentes*/}
          <div className="col-span-8 rounded-2xl border border-gray-800 bg-[#061639] p-8">
            <div className="mb-6 flex justify-between">
              <h3 className="text-xl font-bold">Transações recentes</h3>
              <button className="text-sm text-cyan-400 hover:underline">
                Ver tudo
              </button>
            </div>
            <p className="text-gray-500 italic">
              Lista de transações aparecerá aqui...
            </p>
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
