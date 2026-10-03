import { CirclePlus } from "lucide-react";

import { formatCurrency } from "../../utils/formatters";

/**
 * Molecule: card compacto de próxima sessão.
 *
 * @param {object} props
 * @param {string} props.cliente
 * @param {string} props.formaPagamento
 * @param {number} props.preco
 * @param {number} props.hoursUntil Distância em horas até o início.
 * @param {object} props.tone Cores vindas de `constants/scheduling.js`.
 */
export default function SessionCardRow({
  cliente,
  formaPagamento,
  preco,
  hoursUntil,
  tone,
  className = "",
}) {
  const unit = hoursUntil === 1 ? "hora" : hoursUntil === 0 ? "minutos" : "horas";

  return (
    <div
      className={`flex w-full justify-between rounded-xl border-l-4 p-3 ${tone.bg} ${tone.border} ${className}`}
    >
      <div className="flex items-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
          <CirclePlus className={tone.title} width={20} height={20} />
        </span>
        <div>
          <h4 className={`font-semibold ${tone.title}`}>{cliente}</h4>
          <p className="text-xs font-normal text-[#BBC9CD]">
            Em {hoursUntil} {unit}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <p className={`font-bold ${tone.title}`}>{formatCurrency(preco)}</p>
        <p
          className={`w-fit rounded-full bg-white/5 px-2 py-1 text-[10px] font-bold ${tone.title}`}
        >
          {formaPagamento}
        </p>
      </div>
    </div>
  );
}