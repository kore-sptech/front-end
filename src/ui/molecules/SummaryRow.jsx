import { Trash2 } from "lucide-react";

/**
 * Molecule: linha de resumo de materiais adicionados a um agendamento.
 *
 * @param {object} props
 * @param {string} props.title Nome do produto.
 * @param {number} props.itemCount Quantidade de itens selecionados.
 * @param {number} props.total Soma dos valores unitários.
 * @param {() => void} props.onRemove
 */
export default function SummaryRow({
  title,
  itemCount,
  total,
  onRemove,
  className = "",
}) {
  return (
    <div
      className={`flex items-center gap-4 rounded-lg border border-gray-700/50 bg-[#0A1A3D] p-4 transition-all ${className}`}
    >
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-cyan-400">{title}</h4>
        <p className="mt-1 text-xs text-gray-400">
          {itemCount} {itemCount > 1 ? "itens selecionados" : "item selecionado"}
        </p>
      </div>

      <div className="text-right">
        <p className="text-xs text-gray-400">Valor Total</p>
        <p className="text-sm font-bold text-cyan-400">{total}</p>
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remover ${title}`}
        className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 transition-all hover:border-red-500/60 hover:bg-red-500/20"
      >
        <Trash2 size={16} className="text-red-400" />
      </button>
    </div>
  );
}