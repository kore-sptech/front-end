import MetricCard from "../molecules/MetricCard";
import VariationIndicator from "../molecules/VariationIndicator";
import { formatCurrency } from "../../utils/formatters";

/**
 * Organism: trio de indicadores financeiros do dashboard (receita, despesas
 * e saldo), com variação em relação ao mês anterior.
 *
 * @param {object} props
 * @param {{saldoAtual: number, totalEntradas: number, totalSaidas: number,
 *   mesPassado: {variacaoReceita: number, variacaoDespesa: number}}} props.metrics
 */
export default function FinanceMetrics({ metrics }) {
  const { mesPassado } = metrics;

  return (
    <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
      <MetricCard
        label="Receita Mensal"
        value={formatCurrency(metrics.totalEntradas)}
        tone="cyan"
        footer={
          <VariationIndicator
            value={mesPassado.variacaoReceita}
            suffix="em relação ao mês passado"
          />
        }
      />

      <MetricCard
        label="Despesas Mensais"
        value={formatCurrency(metrics.totalSaidas)}
        tone="red"
        footer={
          <VariationIndicator
            value={mesPassado.variacaoDespesa}
            suffix="em relação ao mês passado"
          />
        }
      />

      <MetricCard
        label="Saldo em Conta"
        value={formatCurrency(metrics.saldoAtual)}
        tone="neutral"
        className="border-cyan-500/20 bg-linear-to-br from-[#061639] to-cyan-900/30 shadow-lg"
      />
    </div>
  );
}