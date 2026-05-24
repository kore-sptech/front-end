import { Calendar, Download, Filter, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";

import { KpiTransacoes } from "../components/KpiTransacoes";
import ModalNovaTransacao from "../components/ModalNovaTransacao";
import Sidebar from "../components/Sidebar";
import { TableTransacoes } from "../components/TableTransacoes";
import { api } from "../utils/api";

export default function TransacoesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [transacoes, setTransacoes] = useState({});

  const obterTransacoes = () => {
    api
      .get("/transacoes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const { data } = response;
        console.log(data);
        setTransacoes(data);
      });
  };

  useEffect(() => {
    obterTransacoes();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#000C24] text-white">
      <Sidebar />

      <main className="flex-1 p-10">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <h1 className="text-4xl font-bold">Transações financeiras</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-full bg-cyan-400 px-6 py-2 font-bold text-black transition-all hover:bg-cyan-300"
          >
            <Plus size={20} /> Nova Transação
          </button>
        </header>
        {/* KPIs */}
        <KpiTransacoes />
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
        <TableTransacoes transacoes={transacoes} />
      </main>
      <ModalNovaTransacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        obterTransacoes={obterTransacoes}
      />
    </div>
  );
}
