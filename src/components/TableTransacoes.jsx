import {
  Calendar,
  LayoutGrid,
  MoreVertical,
  Package,
  Pen,
  Trash,
  Zap,
} from "lucide-react";
import { formatCurrecy, formatDate } from "../utils/formmaters";

import { useSearchParams } from "react-router-dom";

export function TableTransacoes({
  transacoes,
  totalPaginas,
  itemPorPagina,
  totalElementos,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const paginaAtual = searchParams.get("page")
    ? parseInt(searchParams.get("page"))
    : 1;

  const mudarDePagina = (pagina) => {
    setSearchParams((prev) => {
      prev.set("page", pagina);
      return prev;
    });
  };

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-800 bg-[#061639]/50">
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
            {transacoes?.content?.map((item) => (
              <TransacaoRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>

        {/* Paginação */}
        <div className="flex items-center justify-between border-t border-gray-800 p-6 text-xs text-gray-500">
          <p>
            Exibindo {paginaAtual * itemPorPagina + 1} -{" "}
            {Math.min(
              paginaAtual * itemPorPagina + itemPorPagina,
              totalElementos,
            )}{" "}
            de {totalElementos} transações
          </p>
          <div className="flex gap-2">
            {Array.from({
              length: totalPaginas,
            }).map((_, index) => {
              if (index == paginaAtual)
                return (
                  <button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-cyan-400 font-bold text-black">
                    {index + 1}
                  </button>
                );

              return (
                <button
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-white/10"
                  onClick={() => mudarDePagina(index)}
                >
                  {index + 1}
                </button>
              );
            })}

            {/* <span className="flex items-center px-1">...</span> */}
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
          className={`px-8 py-5 font-bold ${item.tipo === "ENTRADA" ? "text-cyan-400" : "text-red-400"}`}
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
          <div className="dropdown dropdown-top dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 border-none bg-transparent shadow-none outline-none"
            >
              <MoreVertical size={20} />
            </div>
            <ul
              tabIndex="-1"
              className="dropdown-content menu rounded-box z-1 w-32 bg-[#061639] p-2 text-gray-500 shadow-sm"
            >
              <li>
                <button className="flex gap-1 hover:bg-red-400/20 hover:text-red-400">
                  <Trash />
                  <span>Excluir</span>
                </button>
              </li>
              <li>
                <button className="flex gap-1 hover:bg-cyan-400/20 hover:text-cyan-400">
                  <Pen />
                  <span>Editar</span>
                </button>
              </li>
            </ul>
          </div>
        </td>
      </tr>
    </>
  );
}
