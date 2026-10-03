import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";

import ChartLegend from "../molecules/ChartLegend";
import EmptyState from "../molecules/EmptyState";
import Panel from "../molecules/Panel";
import { formatCurrency } from "../../utils/formatters";

const CATEGORY_COLORS = {
  MATERIAS: "#22d3ee",
  INSUMOS: "#334155",
  OUTROS: "#1e293b",
};

const FALLBACK_COLOR = "#555";

/**
 * Organism: card principal com o saldo do mês e a variação percentual.
 *
 * @param {object} props
 * @param {object} props.metrics Métricas retornadas por `/transacoes/metricas`.
 * @returns {React.ReactElement}
 */
export function BalanceCard({ metrics }) {
  const variation = metrics?.variacaoPercentual ?? 0;
  const isPositive = variation >= 0;

  return (
    <div className="relative col-span-8 overflow-hidden rounded-2xl border border-gray-800 bg-[#061639] p-8">
      <div className="absolute top-0 left-0 h-full w-1 bg-cyan-400" />

      <p className="mb-2 text-sm font-semibold text-gray-400 uppercase">
        Saldo do Mês
      </p>

      <h2 className="mb-4 text-6xl font-bold">
        {metrics ? formatCurrency(metrics.saldoAtual) : "—"}
      </h2>

      {metrics?.variacaoPercentual != null && (
        <p
          className={`flex items-center gap-2 text-sm ${
            isPositive ? "text-cyan-400" : "text-red-400"
          }`}
        >
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {isPositive ? "+" : ""}
          {variation.toFixed(1)}% em relação ao mês anterior
        </p>
      )}
    </div>
  );
}

/**
 * Organism: entradas e saídas do mês.
 *
 * @param {object} props
 * @param {object} props.metrics
 * @returns {React.ReactElement}
 */
export function CashflowCards({ metrics }) {
  return (
    <div className="col-span-4 flex h-full flex-col justify-between gap-4">
      <div className="flex h-full items-center justify-between rounded-2xl border border-gray-800 bg-[#061639] p-6">
        <div>
          <p className="text-xs text-gray-400 uppercase">Entradas</p>
          <p className="text-2xl font-bold">
            {metrics ? formatCurrency(metrics.totalEntradas) : "—"}
          </p>
        </div>

        <div className="rounded-full bg-cyan-500/10 p-3 text-cyan-400">
          <TrendingUp />
        </div>
      </div>

      <div className="flex h-full items-center justify-between rounded-2xl border border-gray-800 bg-[#061639] p-6">
        <div>
          <p className="text-xs text-gray-400 uppercase">Saídas</p>
          <p className="text-2xl font-bold text-red-400">
            {metrics ? formatCurrency(metrics.totalSaidas) : "—"}
          </p>
        </div>

        <div className="rounded-full bg-red-500/10 p-3 text-red-400">
          <TrendingDown />
        </div>
      </div>
    </div>
  );
}

/**
 * Organism: rosca de gastos por categoria + legenda.
 *
 * @param {object} props
 * @param {Array<{categoria: string, percentual: number}>} props.expenses
 * @returns {React.ReactElement}
 */
export function CategoryChart({ expenses = [] }) {
  const slices = expenses.map((item) => ({
    name: item.categoria,
    value: item.percentual,
    color: CATEGORY_COLORS[item.categoria] ?? FALLBACK_COLOR,
  }));

  return (
    <Panel title="Gastos por categoria" className="col-span-4" bodyClassName="mt-6">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {slices.map((slice) => (
                <Cell key={`cell-${slice.name}`} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ChartLegend
        items={slices.map((slice) => ({
          name: slice.name,
          color: slice.color,
          value: `${slice.value.toFixed(1)}%`,
        }))}
      />
    </Panel>
  );
}

/**
 * Organism: lista das transações recentes.
 *
 * @param {object} props
 * @param {object[]} props.transactions
 * @param {() => void} props.onSeeAll
 * @param {() => void} props.onCreate
 * @returns {React.ReactElement}
 */
export function RecentTransactions({ transactions = [], onSeeAll, onCreate }) {
  return (
    <Panel
      title="Transações recentes"
      className="col-span-8"
      actions={
        <button
          type="button"
          onClick={onSeeAll}
          className="cursor-pointer text-sm text-cyan-400 hover:underline"
        >
          Ver tudo
        </button>
      }
      bodyClassName="mt-6"
    >
      {transactions.length === 0 ? (
        <EmptyState
          title=""
          className="py-6"
          description={
            <>
              Nenhuma transação encontrada. Adicione uma nova transação{" "}
              <button
                type="button"
                onClick={onCreate}
                className="cursor-pointer text-[#48DCFC] underline"
              >
                clicando aqui!
              </button>
            </>
          }
        />
      ) : (
        <ul className="space-y-3">
          {transactions.map((transaction) => {
            const isIncome = transaction.tipo === "ENTRADA";

            return (
              <li
                key={transaction.id}
                className="flex items-center justify-between border-b border-gray-800 py-3"
              >
                <div>
                  <p className="text-sm font-semibold">{transaction.nome}</p>
                  <p className="text-xs text-gray-500">{transaction.categoria}</p>
                </div>

                <span
                  className={`text-sm font-bold ${
                    isIncome ? "text-cyan-400" : "text-red-400"
                  }`}
                >
                  {isIncome ? "+ " : "- "}
                  {formatCurrency(transaction.valor)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}