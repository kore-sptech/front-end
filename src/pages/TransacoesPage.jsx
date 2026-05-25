import {
  Calendar,
  Download,
  Filter,
  ListFilter,
  Plus,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { KpiTransacoes } from "../components/KpiTransacoes";
import ModalNovaTransacao from "../components/ModalNovaTransacao";
import Sidebar from "../components/Sidebar";
import { TableTransacoes } from "../components/TableTransacoes";
import { api } from "../utils/api";
import { useSearchParams } from "react-router-dom";

export default function TransacoesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [transacoes, setTransacoes] = useState({});

  const [filters, setFilters] = useState({
    tipo: "",
    nome: "",
    dataCriacao: "",
    sort: "id,DESC",
  });

  const [searchParams, setSearchParams] = useSearchParams();

  if (searchParams.get("page") == null) {
    setSearchParams({ ...searchParams, page: 0 });
  }

  const obterTransacoes = useCallback(() => {
    // TODO: pequisar sobre compoertamento do use Callback
    api
      .get("/transacoes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page: searchParams.get("page") || 0,
          tipo: filters.tipo,
          nome: filters.nome,
          dataCriacao: filters.dataCriacao,
          sort: filters.sort,
        },
      })
      .then((response) => {
        const { data } = response;
        console.log(data);
        setTransacoes(data);
      });
  }, [searchParams, filters]);

  useEffect(() => {
    obterTransacoes();
  }, [obterTransacoes]);

  return (
    <div className="flex min-h-screen bg-[#000C24] text-white">
      <Sidebar />

      <main className="flex-1 p-10">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">Transações financeiras</h1>

            <span className="block h-1 w-12 rounded-3xl bg-[#48DCFC]" />
          </div>

          <button
            className="flex cursor-pointer gap-2 rounded-xl bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] px-6 py-2.5 font-bold text-[#003640] shadow-xl shadow-cyan-500/20"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} /> Nova Transação
          </button>
        </header>
        {/* KPIs */}
        <KpiTransacoes />
        {/* Filtros */}
        <div className="mb-8 flex gap-4">
          <div className="flex rounded-lg border border-gray-800 bg-[#061639] p-1">
            <input
              id="dataCriacao"
              name="dataCriacao"
              type="date"
              className="input border-none bg-[#061639] text-white shadow-none outline-none placeholder:text-gray-500 focus:border-cyan-400"
              value={filters.dataCriacao}
              onChange={(e) =>
                setFilters({ ...filters, dataCriacao: e.target.value })
              }
            />

            <select
              className="select cursor-pointer border-none bg-[#061639] shadow-none outline-none focus:border-cyan-400"
              value={filters.tipo}
              onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
            >
              <option value={""}>Todos</option>
              <option value={"ENTRADA"}>Entrada</option>
              <option value={"SAIDA"}>Saída</option>
            </select>
            {/* <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400">
              Todos
            </button> */}
          </div>

          <div className="relative flex-1">
            <Search
              className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Nome, descrição ou categoria..."
              className="w-full rounded-lg border border-gray-800 bg-[#061639] py-3 pr-4 pl-12 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex rounded-lg border border-gray-800 bg-[#061639] p-1 focus:border-cyan-400 selection:focus:border-cyan-400">
            <select
              className="select w-44 cursor-pointer rounded-lg border border-none border-gray-800 bg-[#061639] p-3 text-gray-400 shadow-none outline-none hover:text-white focus:border-cyan-400"
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
            >
              <option value={"id,DESC"}>Mais Recentes</option>
              <option value={"id,ASC"}>Mais Antigos</option>
              <option value={"valor,DESC"}>Do Maior ao Menor</option>
              <option value={"valor,ASC"}>Do Menor ao Maior</option>
            </select>
          </div>
          <button
            className="rounded-lg border border-gray-800 bg-[#061639] p-3 text-gray-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            disabled
          >
            <Download size={20} />
          </button>
        </div>
        {/* Tabela de Transações */}
        <TableTransacoes
          transacoes={transacoes}
          itemPorPagina={transacoes.numberOfElements}
          totalPaginas={transacoes.totalPages}
          totalElementos={transacoes.totalElements}
          obterTransacoes={obterTransacoes}
        />
      </main>
      <ModalNovaTransacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        obterTransacoes={obterTransacoes}
      />
    </div>
  );
}
