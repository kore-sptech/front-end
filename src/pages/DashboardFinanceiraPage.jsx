import Sidebar from "../components/Sidebar";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Plus, TrendingUp } from "lucide-react";
import { useState } from "react";
import ModalNovaTransacao from "../components/ModalNovaTransacao";

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
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Relatório Financeiro</h1>
          <button onClick={() => setIsModalOpen(true)}
          className="bg-cyan-400 text-black px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-cyan-300 transition-all">
            <Plus size={20} /> Nova Transação
          </button>
        </header>

        {/* Grid de Cards */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Card Principal - Saldo */}
          <div className="col-span-8 bg-[#061639] p-8 rounded-2xl border border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400"></div>
            <p className="text-gray-400 uppercase text-sm font-semibold mb-2">Saldo do Mês</p>
            <h2 className="text-6xl font-bold mb-4">R$ 2.100,00</h2>
            <p className="text-cyan-400 flex items-center gap-2 text-sm">
              <TrendingUp size={16} /> +12% em relação ao mês anterior
            </p>
            
            <div className="grid grid-cols-2 gap-4 mt-10">
                <div>
                    <p className="text-xs text-gray-400 uppercase">Faturamento Bruto</p>
                    <p className="text-2xl font-bold">R$ 5.420,00</p>
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase">Previsão Próximo Mês</p>
                    <p className="text-2xl font-bold text-gray-300">R$ 6.100,00</p>
                </div>
            </div>
          </div>

          {/* KPIs de entrada e saída */}
          <div className="col-span-4 flex flex-col gap-4">
            <div className="bg-[#061639] p-6 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase">Entradas</p>
                <p className="text-2xl font-bold">R$ 3.000,00</p>
              </div>
              <div className="bg-cyan-500/10 p-3 rounded-full text-cyan-400"><TrendingUp /></div>
            </div>
            
            <div className="bg-[#061639] p-6 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase">Saídas</p>
                <p className="text-2xl font-bold text-red-400 text-opacity-80">R$ 900,00</p>
              </div>
            </div>
          </div>

          {/* Gráfico de Gastos */}
          <div className="col-span-4 bg-[#061639] p-8 rounded-2xl border border-gray-800">
            <h3 className="text-xl font-bold mb-6">Gastos por categoria</h3>
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
                            <span className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></span>
                            {item.name}
                        </span>
                        <span className="font-bold">{item.value}%</span>
                    </div>
                ))}
            </div>
          </div>

          {/* Transações Recentes*/}
          <div className="col-span-8 bg-[#061639] p-8 rounded-2xl border border-gray-800">
             <div className="flex justify-between mb-6">
                <h3 className="text-xl font-bold">Transações recentes</h3>
                <button className="text-cyan-400 text-sm hover:underline">Ver tudo</button>
             </div>
             <p className="text-gray-500 italic">Lista de transações aparecerá aqui...</p>
          </div>

        </div>
      </main>
      <ModalNovaTransacao isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}