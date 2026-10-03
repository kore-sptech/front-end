import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Package,
  Pen,
  Trash,
  Zap,
} from "lucide-react";
import { useState } from "react";

import Badge from "../atoms/Badge";
import ConfirmDialog from "../molecules/ConfirmDialog";
import EmptyState from "../molecules/EmptyState";
import Pagination from "../molecules/Pagination";
import { useTransactionRemoval } from "../../features/transactions/useTransactionActions";
import { formatCurrency, formatDate } from "../../utils/formatters";

const CATEGORY_ICONS = {
  INSUMOS: Zap,
  MATERIAS: Package,
  SESSAO: Calendar,
  OUTROS: LayoutGrid,
};

/**
 * Organism: tabela paginada de transações com ações de edição e exclusão.
 *
 * @param {object} props
 * @param {object[]} props.transactions Itens da página atual.
 * @param {number} props.total Total de itens.
 * @param {number} props.page Página atual (base 1).
 * @param {number} props.pageSize Itens por página.
 * @param {number} props.totalPages
 * @param {(page: number) => void} props.onPageChange
 * @param {(transaction: object) => void} props.onEdit
 * @param {() => void} props.onRefresh
 */
export default function TransactionsTable({
  transactions = [],
  total = 0,
  page = 1,
  pageSize = 10,
  totalPages = 1,
  onPageChange,
  onEdit,
  onRefresh,
}) {
  const [pendingDelete, setPendingDelete] = useState(null);
  const { isDeleting, remove } = useTransactionRemoval(onRefresh);

  const confirmDelete = async () => {
    const deleted = await remove(pendingDelete.id);

    if (deleted) setPendingDelete(null);
  };

  const hasSession = (transaction) => transaction.sessao != null;

  const firstIndex = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastIndex = Math.min(page * pageSize, total);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#061639]/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
              <th className="w-[40%] px-8 py-5 font-semibold">Nome</th>
              <th className="w-[15%] px-8 py-5 font-semibold">Valor</th>
              <th className="w-[15%] px-8 py-5 text-center font-semibold">
                Tipo
              </th>
              <th className="w-[15%] px-8 py-5 font-semibold">Data</th>
              <th className="w-[15%] px-8 py-5 text-right font-semibold">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800/50">
            {transactions.map((transaction) => {
              const Icon = CATEGORY_ICONS[transaction.categoria] ?? LayoutGrid;
              const isIncome = transaction.tipo === "ENTRADA";

              return (
                <tr
                  key={transaction.id}
                  className="group transition-colors hover:bg-white/5"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-cyan-500/10 p-3 text-cyan-400">
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{transaction.nome}</p>
                        <p className="text-[10px] font-bold text-gray-500">
                          {transaction.categoria}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td
                    className={`px-8 py-5 font-bold ${
                      isIncome ? "text-cyan-400" : "text-red-400"
                    }`}
                  >
                    {formatCurrency(transaction.valor)}
                  </td>

                  <td className="px-8 py-5 text-center">
                    <Badge
                      size="sm"
                      tone={isIncome ? "success" : "danger"}
                      className="text-[10px] font-extrabold"
                    >
                      {transaction.tipo}
                    </Badge>
                  </td>

                  <td className="px-8 py-5 text-sm text-gray-400">
                    {formatDate(transaction.dataCriacao)}
                  </td>

                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        disabled={hasSession(transaction)}
                        title={
                          hasSession(transaction)
                            ? "Transações de sessão não podem ser excluídas"
                            : "Excluir"
                        }
                        onClick={() => setPendingDelete(transaction)}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-red-400/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(transaction)}
                        title="Editar"
                        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-cyan-400/10 hover:text-cyan-400"
                      >
                        <Pen size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 ? (
        <EmptyState
          title="Sem transações"
          description="Nenhuma transação encontrada para os filtros atuais."
        />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-800 p-6 text-xs text-gray-500">
          <p>
            Exibindo {firstIndex} - {lastIndex} de {total} transações
          </p>

          <Pagination
            total={totalPages}
            current={page}
            onChange={onPageChange}
            previous={<ChevronLeft size={14} />}
            next={<ChevronRight size={14} />}
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Excluir Transação"
        description="Tem certeza de que deseja excluir esta transação?"
        confirmLabel={isDeleting ? "Excluindo..." : "Excluir"}
        onConfirm={confirmDelete}
      />
    </div>
  );
}