import { Download, Plus, X } from "lucide-react";
import {
  TRANSACTION_SORTS,
  TRANSACTION_TYPES,
} from "../../features/transactions/transactionForm";

import Button from "../../ui/atoms/Button";
import Control from "../../ui/atoms/Control";
import EmptyState from "../../ui/molecules/EmptyState";
import FinanceMetrics from "../../ui/organisms/FinanceMetrics";
import IconButton from "../../ui/atoms/IconButton";
import PageHeader from "../../ui/molecules/PageHeader";
import SearchInput from "../../ui/molecules/SearchInput";
import TransactionFormModal from "../../ui/organisms/TransactionFormModal";
import TransactionsTable from "../../ui/organisms/TransactionsTable";
import { useState } from "react";
import { useTransactions } from "../../features/transactions/useTransactions";

/**
 * Page: listagem financeira com filtros, métricas, tabela paginada e exportação CSV.
 *
 * @returns {React.ReactElement}
 */
export default function TransactionsPage() {
  const {
    transactions,
    metrics,
    filters,
    search,
    setSearch,
    setFilter,
    clearFilters,
    hasActiveFilters,
    goToPage,
    refresh,
  } = useTransactions();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const closeCreate = () => {
    setIsCreateOpen(false);
    refresh();
  };

  const closeEdit = () => {
    setEditing(null);
    refresh();
  };

  const exportCSV = () => {
    const list = transactions.content || [];
    if (list.length === 0) return;

    const headers = ["ID", "Nome", "Tipo", "Valor", "Categoria", "Data"];
    const rows = list.map((t) => [
      t.id,
      `"${(t.nome || "").replace(/"/g, '""')}"`,
      t.tipo,
      t.valor,
      t.categoria,
      t.dataCriacao ? new Date(t.dataCriacao).toLocaleDateString("pt-BR") : "",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_financeiro_kore_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="h-full w-full overflow-auto bg-[#000C24] p-6 text-white">
      <PageHeader
        title="TRANSAÇÕES FINANCEIRAS"
        className="mb-6"
        actions={
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus size={20} /> Nova Transação
          </Button>
        }
      />

      <FinanceMetrics metrics={metrics} />

      <div className="no-scrollbar mb-8 flex flex-nowrap items-center gap-4 overflow-x-auto">
        <div className="flex shrink-0 items-center rounded-lg border border-gray-800 bg-[#061639] p-1">
          <Control
            as="input"
            type="date"
            aria-label="Filtrar por data de criação"
            value={filters.dataCriacao}
            onChange={(event) => setFilter("dataCriacao", event.target.value)}
            className="w-32 border-none bg-transparent shadow-none"
          />

          <Control
            as="select"
            aria-label="Filtrar por tipo"
            value={filters.tipo}
            onChange={(event) => setFilter("tipo", event.target.value)}
            className="w-20 border-none bg-transparent shadow-none"
          >
            {TRANSACTION_TYPES.map((type) => (
              <option key={type.value || "todos"} value={type.value}>
                {type.label}
              </option>
            ))}
          </Control>
        </div>

        <SearchInput
          className="h-12 w-72"
          value={search}
          onChange={setSearch}
          placeholder="Nome, descrição ou categoria..."
        />

        <Control
          as="select"
          aria-label="Ordenar transações"
          value={filters.sort}
          width="compact"
          onChange={(event) => setFilter("sort", event.target.value)}
          className="h-12 text-xs"
        >
          {TRANSACTION_SORTS.map((sort) => (
            <option key={sort.value} value={sort.value} className="text-xs">
              {sort.label}
            </option>
          ))}
        </Control>

        <IconButton
          variant="subtle"
          size="md"
          title="Exportar relatório CSV"
          onClick={exportCSV}
          disabled={!transactions.content?.length}
          className="shrink-0 text-[#23CBEA]"
        >
          <Download size={20} />
        </IconButton>

        <IconButton
          variant="subtle"
          size="md"
          title="Limpar filtros"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="shrink-0"
        >
          <X size={20} />
        </IconButton>
      </div>

      {transactions.content?.length ? (
        <TransactionsTable
          transactions={transactions.content}
          total={transactions.totalElements}
          page={(transactions.number ?? 0) + 1}
          pageSize={transactions.size || transactions.numberOfElements || 10}
          totalPages={transactions.totalPages || 1}
          onPageChange={(next) => goToPage(next - 1)}
          onEdit={setEditing}
          onRefresh={refresh}
        />
      ) : (
        <EmptyState
          title="NENHUMA TRANSAÇÃO ENCONTRADA"
          description={
            <>
              Cadastre{" "}
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="cursor-pointer text-[#23CBEA] underline"
              >
                clicando aqui!
              </button>
            </>
          }
        />
      )}

      <TransactionFormModal
        key={isCreateOpen ? "aberto" : "fechado"}
        isOpen={isCreateOpen}
        onClose={closeCreate}
        onSaved={refresh}
      />

      <TransactionFormModal
        key={`${editing?.id ?? "modal"}-${editing ? "aberto" : "fechado"}`}
        isOpen={Boolean(editing)}
        onClose={closeEdit}
        transaction={editing}
        onSaved={closeEdit}
      />
    </main>
  );
}
