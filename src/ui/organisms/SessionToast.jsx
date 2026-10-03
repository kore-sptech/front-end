import {
  AlarmClock,
  Calendar,
  CheckCircle,
  Clock,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import Badge from "../atoms/Badge";
import Button from "../atoms/Button";
import IconButton from "../atoms/IconButton";

/**
 * Organism: card do toast de agendamento próximo.
 * Renderizado pelo Sonner via `toast.custom` (ver `NotificationProvider`).
 *
 * @param {object} props
 * @param {string|number} props.id Id do toast (injetado pelo Sonner).
 * @param {string} props.clientName
 * @param {string} props.sessionType
 * @param {string} props.scheduledTime
 * @param {string} [props.description] Metadados (valor, pagamento, telefone).
 * @param {(id: string|number) => Promise<void>|void} [props.onConfirm]
 * @param {(id: string|number) => Promise<void>|void} [props.onCancel]
 */
export default function SessionToast({
  id,
  clientName,
  sessionType,
  scheduledTime,
  description,
  onConfirm,
  onCancel,
}) {
  const run = async (action) => {
    await action?.(id);
    toast.dismiss(id);
  };

  return (
    <div className="w-[360px] overflow-hidden rounded-2xl border border-gray-800 bg-[#061639]/95 shadow-2xl shadow-black/60 backdrop-blur-sm">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#48DCFC] to-[#0CC0DF]" />

      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-cyan-500/10 p-2.5 text-cyan-400">
              <Calendar size={18} />
            </div>

            <div>
              <p className="text-[10px] font-extrabold tracking-widest text-gray-500 uppercase">
                Agendamento Próximo
              </p>
              <p className="text-base leading-tight font-bold text-white">
                {clientName}
              </p>
            </div>
          </div>

          <IconButton
            onClick={() => toast.dismiss(id)}
            title="Fechar notificação"
            className="hover:bg-white/5"
          >
            <X size={16} />
          </IconButton>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Clock size={13} className="text-gray-600" strokeWidth={2} />
            <span className="text-xs font-semibold">{scheduledTime}</span>
          </div>

          <span className="text-gray-700">·</span>

          <Badge size="sm" className="uppercase">
            {sessionType}
          </Badge>
        </div>

        {description && (
          <div className="rounded-xl border border-gray-800 bg-[#000C24]/60 px-3.5 py-2.5">
            <p className="text-[11px] leading-relaxed font-semibold text-gray-400">
              {description}
            </p>
          </div>
        )}

        <div className="h-px bg-gray-800" />

        <div className="flex flex-col gap-2">
          <Button
            fullWidth
            onClick={() => run(onConfirm)}
            className="text-xs tracking-wide uppercase"
          >
            <CheckCircle size={15} strokeWidth={2.5} />
            Confirmar {sessionType}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={() => run(onCancel)}
              className="flex-1 text-[11px] tracking-wide uppercase"
            >
              <XCircle size={14} strokeWidth={2} />
              Cancelar Sessão
            </Button>

            <Button
              variant="subtle"
              size="sm"
              disabled
              title="Disponível em breve"
              className="cursor-not-allowed text-[11px] tracking-wide text-gray-700 uppercase opacity-40 select-none"
            >
              <AlarmClock size={14} strokeWidth={2} />
              +5 min
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}