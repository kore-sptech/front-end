import Sidebar from "../components/Sidebar";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Plus, TrendingUp } from "lucide-react";
import ModalNovaTransacao from "../components/ModalNovaTransacao";
import { api } from "../utils/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CORES_CATEGORIA = {
  MATERIAS: "#22d3ee",
  INSUMOS: "#334155",
  OUTROS: "#1e293b",
};

export default function DashboardFinanceiraPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [metricas, setMetricas] = useState(null);
  const [transacoes, setTransacoes] = useState([]);
  const navigate = useNavigate();

  const dataPizza = metricas
    ? metricas.gastosPorCategoria.map((item) => ({
      name: item.categoria,
      value: item.percentual,
      color: CORES_CATEGORIA[item.categoria] ?? "#555",
    }))
    : [];

  const fetchMetricas = () => {
    api.get("/transacoes/metricas", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setMetricas(res.data))
      .catch(() => toast.error("Erro ao carregar métricas"));
  };

  const fetchTransacoes = () => {
    api.get("/transacoes", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => setTransacoes(res.data.content)) // ← Page<T> do Spring retorna .content
      .catch(() => toast.error("Erro ao carregar transações"));
  };

  useEffect(() => {
    fetchMetricas();
    fetchTransacoes();
  }, []);

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
            <h2 className="text-6xl font-bold mb-4">
              {metricas ? metricas.saldoAtual.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}
            </h2>
            {metricas?.variacaoPercentual != null && (
              <p className="text-cyan-400 flex items-center gap-2 text-sm">
                <TrendingUp size={16} /> {metricas.variacaoPercentual > 0 ? "+" : ""}{metricas.variacaoPercentual.toFixed(1)}% em relação ao mês anterior
              </p>
            )}

            <div className="grid grid-cols-2 gap-4 mt-10">
              <div>
                <p className="text-xs text-gray-400 uppercase">Faturamento Bruto</p>
                <p className="text-2xl font-bold">
                  {metricas ? metricas.totalEntradas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Previsão Próximo Mês</p>
                <p className="text-2xl font-bold text-gray-300">
                  {metricas ? metricas.previsaoProximoMes?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* KPIs de entrada e saída */}
          <div className="col-span-4 flex flex-col gap-4">
            <div className="bg-[#061639] p-6 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase">Entradas</p>
                <p className="text-2xl font-bold">
                  {metricas ? metricas.totalEntradas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}
                </p>
              </div>
              <div className="bg-cyan-500/10 p-3 rounded-full text-cyan-400"><TrendingUp /></div>
            </div>

            <div className="bg-[#061639] p-6 rounded-2xl border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase">Saídas</p>
                <p className="text-2xl font-bold text-red-400 text-opacity-80">
                  {metricas ? metricas.totalSaidas.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}
                </p>
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
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                    {item.name}
                  </span>
                  <span className="font-bold">{item.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Transações Recentes*/}
          <div className="col-span-8 bg-[#061639] p-8 rounded-2xl border border-gray-800">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">Transações recentes</h3>
              <button
                onClick={() => navigate("/transacoes")}
                className="text-cyan-400 text-sm hover:underline"
              >
                Ver tudo
              </button>
            </div>
            {transacoes.length === 0 ? (
              <p className="text-gray-500 italic">Nenhuma transação encontrada.</p>
            ) : (
              <ul className="space-y-3">
                {transacoes.map((t) => (
                  <li key={t.id} className="flex items-center justify-between py-3 border-b border-gray-800">
                    <div>
                      <p className="font-semibold text-sm">{t.nome}</p>
                      <p className="text-xs text-gray-500">{t.categoria}</p>
                    </div>
                    <span className={`font-bold text-sm ${t.tipo === "ENTRADA" ? "text-cyan-400" : "text-red-400"}`}>
                      {t.tipo === "ENTRADA" ? "+ " : "- "}
                      {t.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </main>
      <ModalNovaTransacao
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchMetricas();
          fetchTransacoes();
        }}
      />

    </div>
  );
}