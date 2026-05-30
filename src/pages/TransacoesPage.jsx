import {
  Calendar,
  Download,
  Filter,
  ListFilter,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { KpiTransacoes } from "../components/KpiTransacoes";
import ModalAtualizaTransacao from "../components/ModalAtualizaTransacao";
import ModalNovaTransacao from "../components/ModalNovaTransacao";
import Sidebar from "../components/Sidebar";
import { TableTransacoes } from "../components/TableTransacoes";
import { api } from "../utils/api";
import { useSearchParams } from "react-router-dom";

export default function TransacoesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalAtualizaOpen, setIsModalAtualizaOpen] = useState(false);

  const [transacoes, setTransacoes] = useState({});

  const [filters, setFilters] = useState({
    tipo: "",
    nome: "",
    dataCriacao: "",
    sort: "id,DESC",
  });

  const [transacaoAtual, setTransacaoAtual] = useState(null);

  const [searchNome, setSearchNome] = useState(filters.nome);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || 0;

  useEffect(() => {
    if (searchParams.get("page") == null) {
      setSearchParams({ page: 0 });
    }
  }, [searchParams, setSearchParams]);

  // Debounce search input: only update filters.nome after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, nome: searchNome }));
    }, 250);

    return () => clearTimeout(handler);
  }, [searchNome]);

  const [metricas, setMetricas] = useState({
    saldoAtual: 0,
    totalEntradas: 0,
    totalSaidas: 0,
    mesPassado: {
      variacaoReceita: 0,
      variacaoDespesa: 0,
    },
  });

  const obterMetricas = useCallback(() => {
    api
      .get("/transacoes/metricas", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const { data } = response;

        setMetricas({
          ...data,
        });
      });
  }, []);

  const obterTransacoes = useCallback(() => {
    // TODO: pequisar sobre compoertamento do use Callback
    api
      .get("/transacoes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page: page,
          tipo: filters.tipo,
          dataCriacao: filters.dataCriacao,
          sort: filters.sort,
          busca: filters.nome,
        },
      })
      .then((response) => {
        const { data } = response;
        console.log(data);
        setTransacoes(data);
      });
  }, [page, filters.nome, filters.dataCriacao, filters.tipo, filters.sort]);

  const selecionarTransacao = (transacao) => {
    setTransacaoAtual(transacao);
    setIsModalAtualizaOpen(true);
  };

  useEffect(() => {
    obterMetricas();
    obterTransacoes();
  }, [obterMetricas, obterTransacoes]);

  const limparFiltros = () => {
    setFilters({
      tipo: "",
      nome: "",
      dataCriacao: "",
      sort: "id,DESC",
    });
    setSearchNome("");
  };

  const algumFiltroSelecionado =
    filters.nome != "" ||
    filters.dataCriacao != "" ||
    filters.tipo != "" ||
    filters.sort != "id,DESC";

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
        <KpiTransacoes metricas={metricas} />
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
              value={searchNome}
              onChange={(ev) => {
                setSearchNome(ev.target.value);
              }}
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

          <button
            className="rounded-lg border border-gray-800 bg-[#061639] p-3 text-gray-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            onClick={limparFiltros}
            disabled={!algumFiltroSelecionado}
          >
            <X size={20} />
          </button>
        </div>
        {/* Tabela de Transações */}

        {transacoes.content?.length != 0 && (
          <TableTransacoes
            transacoes={transacoes}
            itemPorPagina={transacoes.numberOfElements}
            totalPaginas={transacoes.totalPages}
            totalElementos={transacoes.totalElements}
            obterTransacoes={obterTransacoes}
            obterMetricas={obterMetricas}
            selecionarTransacao={selecionarTransacao}
          />
        )}

        {transacoes.content?.length == 0 && (
          <div className="mt-44 flex flex-col items-center justify-center text-center text-gray-400">
            <h1 className="text-4xl font-semibold text-[#DAE2FF]">
              NENHUMA TRANSAÇÃO ENCONTRADA
            </h1>

            <h2 className="text-2xl font-light text-[#DAE2FF]">
              Cadestre{"  "}
              <span
                className="cursor-pointer text-[#23CBEA] underline"
                onClick={() => setIsModalOpen(true)}
              >
                clicando aqui
              </span>
            </h2>
          </div>
        )}
      </main>
      <ModalNovaTransacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        obterTransacoes={obterTransacoes}
      />

      <ModalAtualizaTransacao
        isOpen={isModalAtualizaOpen}
        onClose={() => setIsModalAtualizaOpen(false)}
        transacao={transacaoAtual}
        obterTransacoes={obterTransacoes}
      />
    </div>
  );
}
