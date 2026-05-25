import { formatCurrecy } from "../utils/formmaters";

export function KpiTransacoes({ metricas }) {
  return (
    <>
      <div className="mb-10 grid grid-cols-3 gap-6">
        <div className="rounded-2xl border border-gray-800 bg-[#061639] p-6">
          <p className="mb-2 text-xs font-bold text-cyan-400 uppercase">
            Receita Mensal
          </p>
          <h2 className="text-3xl font-bold">
            {formatCurrecy(metricas.totalEntradas)}
          </h2>
          <p className="mt-2 text-xs text-gray-500">
            +12.4% em relação ao mês passado
          </p>
        </div>
        <div className="rounded-2xl border border-gray-800 bg-[#061639] p-6">
          <p className="mb-2 text-xs font-bold text-red-400 uppercase">
            Despesas Mensais
          </p>
          <h2 className="text-3xl font-bold">
            {formatCurrecy(metricas.totalSaidas)}
          </h2>
          <p className="mt-2 text-xs text-gray-500">
            -4.2% em relação ao mês passado
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-[#061639] to-cyan-900/30 p-6 shadow-lg">
          <p className="mb-2 text-xs font-bold text-gray-300 uppercase">
            Saldo em Conta
          </p>
          <h2 className="text-3xl font-bold">
            {formatCurrecy(metricas.saldoAtual)}
          </h2>
          <button className="mt-2 text-xs text-cyan-400 hover:underline">
            VER EXTRATO DETALHADO →
          </button>
        </div>
      </div>
    </>
  );
}
