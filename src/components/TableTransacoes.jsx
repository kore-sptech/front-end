import { Calendar, LayoutGrid, MoreVertical, Package, Zap } from "lucide-react";
import { formatCurrecy, formatDate } from "../utils/formmaters";

// Dados fictícios para a tabela

export function TableTransacoes({ transacoes }) {
  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#061639]/50">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase">
              <th className="px-8 py-5 font-semibold">Nome</th>
              <th className="px-8 py-5 font-semibold">Valor</th>
              <th className="px-8 py-5 text-center font-semibold">Tipo</th>
              <th className="px-8 py-5 font-semibold">Data</th>
              <th className="px-8 py-5 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {transacoes?.content?.map((item) => (
              <TransacaoRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>

        {/* Paginação */}
        <div className="flex items-center justify-between border-t border-gray-800 p-6 text-xs text-gray-500">
          <p>Exibindo 1 - 5 de 128 transações</p>
          <div className="flex gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded bg-cyan-400 font-bold text-black">
              1
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/10">
              2
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/10">
              3
            </button>
            <span className="flex items-center px-1">...</span>
            <button className="flex h-8 w-8 items-center justify-center rounded hover:bg-white/10">
              12
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function TransacaoRow({ item }) {
  console.log(item);
  return (
    <>
      <tr key={item.id} className="group transition-colors hover:bg-white/5">
        <td className="px-8 py-5">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-cyan-500/10 p-3 text-cyan-400">
              {item.categoria == "INSUMOS" && <Zap size={20} />}
              {item.categoria == "MATERIAS" && <Package size={20} />}
              {item.categoria == "SESSAO" && <Calendar size={20} />}
              {item.categoria == "OUTROS" && <LayoutGrid size={20} />}
            </div>
            <div>
              <p className="text-sm font-bold">{item.nome}</p>
              <p className="text-[10px] font-bold text-gray-500">
                {item.categoria}
              </p>
            </div>
          </div>
        </td>
        <td
          className={`px-8 py-5 font-bold ${item.valor > 0 ? "text-cyan-400" : "text-red-400"}`}
        >
          {formatCurrecy(item.valor)}
        </td>
        <td className="px-8 py-5 text-center">
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-extrabold ${item.tipo === "ENTRADA" ? "bg-cyan-400/20 text-cyan-400" : "bg-red-400/20 text-red-400"}`}
          >
            {item.tipo}
          </span>
        </td>
        <td className="px-8 py-5 text-sm text-gray-400">
          {formatDate(item.dataCriacao)}
        </td>
        <td className="px-8 py-5 text-right">
          <button className="text-gray-500 hover:text-white">
            <MoreVertical size={20} />
          </button>
        </td>
      </tr>
    </>
  );
}
