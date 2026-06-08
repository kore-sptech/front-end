import {
  AlarmClock,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Phone,
  X,
  XCircle,
} from "lucide-react";

import { toast } from "sonner";

/**
 * SessionToast — alerta de agendamento próximo
 * Design system: KORE (bg #000C24 · surface #061639 · accent #48DCFC/#0CC0DF)
 *
 * @param {string|number} id            - ID do toast (injetado pelo Sonner via toast.custom)
 * @param {string}        clientName    - Nome do cliente
 * @param {string}        sessionType   - Tipo de sessão ("Tatuagem", "Consulta"…)
 * @param {string}        scheduledTime - Horário formatado ("15:10")
 * @param {string}        [description] - Linha de metadados (valor, pagamento, tel…)
 * @param {Function}      onConfirm     - async (id) => void
 * @param {Function}      onCancel      - async (id) => void
 */
export function SessionToast({
  id,
  clientName,
  sessionType,
  scheduledTime,
  description,
  onConfirm,
  onCancel,
}) {
  const handleConfirm = async () => {
    await onConfirm?.(id);
    toast.dismiss(id);
  };

  const handleCancel = async () => {
    await onCancel?.(id);
    toast.dismiss(id);
  };

  return (
    <div className="w-[360px] overflow-hidden rounded-2xl border border-gray-800 bg-[#061639]/95 shadow-2xl shadow-black/60 backdrop-blur-sm">
      {/* ── Faixa accent no topo ── */}
      <div className="h-[3px] w-full bg-gradient-to-r from-[#48DCFC] to-[#0CC0DF]" />

      <div className="flex flex-col gap-4 p-5">
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Ícone com mesmo padrão da tabela: rounded-full + cyan-500/10 */}
            <div className="rounded-full bg-cyan-500/10 p-2.5 text-cyan-400">
              <Calendar size={18} />
            </div>
            <div>
              {/* Label eyebrow — mesmo xs uppercase das tabelas */}
              <p className="text-[10px] font-extrabold tracking-widest text-gray-500 uppercase">
                Agendamento Próximo
              </p>
              <p className="text-base leading-tight font-bold text-white">
                {clientName}
              </p>
            </div>
          </div>

          <button
            onClick={() => toast.dismiss(id)}
            className="mt-0.5 cursor-pointer rounded-lg p-1.5 text-gray-500 transition-colors duration-150 hover:bg-white/5 hover:text-gray-300"
            aria-label="Fechar notificação"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Metadados da sessão ── */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Horário */}
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock size={13} className="text-gray-600" strokeWidth={2} />
            <span className="text-xs font-semibold">{scheduledTime}</span>
          </div>

          <span className="text-gray-700">·</span>

          {/* Badge de tipo — mesmo padrão rounded-full da tabela */}
          <span className="rounded-full bg-cyan-400/20 px-3 py-0.5 text-[10px] font-extrabold tracking-wider text-cyan-400 uppercase">
            {sessionType}
          </span>
        </div>

        {/* ── Linha de detalhes (valor · pagamento · tel) ── */}
        {description && (
          <div className="rounded-xl border border-gray-800 bg-[#000C24]/60 px-3.5 py-2.5">
            <p className="text-[11px] leading-relaxed font-semibold text-gray-400">
              {description}
            </p>
          </div>
        )}

        {/* ── Divider ── */}
        <div className="h-px bg-gray-800" />

        {/* ── Ações ── */}
        <div className="flex flex-col gap-2">
          {/* Confirmar — botão primário idêntico ao "Agendar" e "Nova Transação" */}
          <button
            onClick={handleConfirm}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#48DCFC] to-[#0CC0DF] px-6 py-2.5 text-xs font-bold tracking-wide text-[#003640] uppercase shadow-xl shadow-cyan-500/20 transition-all duration-150 hover:shadow-cyan-500/40 hover:brightness-105 active:scale-[0.98]"
          >
            <CheckCircle size={15} strokeWidth={2.5} />
            Confirmar {sessionType}
          </button>

          <div className="flex gap-2">
            {/* Cancelar — outline destrutivo, padrão do botão "Cancelar" dos modais */}
            <button
              onClick={handleCancel}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-red-400/30 bg-transparent px-4 py-2.5 text-[11px] font-bold tracking-wide text-red-400 uppercase transition-all duration-150 hover:border-red-400/60 hover:bg-red-400/5 active:scale-[0.98]"
            >
              <XCircle size={14} strokeWidth={2} />
              Cancelar Sessão
            </button>

            {/* Adiar — disabled · sprint futura */}
            <button
              disabled
              title="Disponível em breve"
              className="flex cursor-not-allowed items-center justify-center gap-1.5 rounded-xl border border-gray-800 bg-transparent px-3 py-2.5 text-[11px] font-bold tracking-wide text-gray-700 uppercase opacity-40 select-none"
            >
              <AlarmClock size={14} strokeWidth={2} />
              +5 min
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
