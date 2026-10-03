import { X } from "lucide-react";

import IconButton from "../atoms/IconButton";
import { ROW_HEIGHT_PX } from "../../constants/scheduling";

/**
 * Molecule: bloco de sessão posicionado sobre a grade semanal.
 *
 * @param {object} props
 * @param {object} props.session Agendamento exibido.
 * @param {object} props.tone Cores vindas de `resolveSessionTone`.
 * @param {number} props.startHour Hora inicial (fracionária).
 * @param {number} props.durationHours Duração em horas.
 * @param {number} props.column Índice do dia na grade (0 = domingo).
 * @param {() => void} props.onOpen Abre o modal de edição.
 * @param {() => void} [props.onCancel] Exibe o botão de cancelamento.
 */
export default function SessionEventBlock({
  session,
  tone,
  startHour,
  durationHours,
  column,
  onOpen,
  onCancel,
}) {
  return (
    <div
      className="group absolute z-10 p-0.5"
      style={{
        top: startHour * ROW_HEIGHT_PX,
        height: durationHours * ROW_HEIGHT_PX,
        minHeight: durationHours * ROW_HEIGHT_PX,
        width: "calc(100% / 7)",
        left: `calc(100% / 7 * ${column})`,
      }}
    >
      {onCancel && (
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            onCancel();
          }}
          title={`Cancelar sessão de ${session.cliente}`}
          className="absolute top-1.5 right-1.5 z-30 h-4 w-4 rounded-full bg-[#0A1F4B] opacity-0 group-hover:opacity-100"
        >
          <X size={10} strokeWidth={3} />
        </IconButton>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
          }
        }}
        className={`flex h-full w-full cursor-pointer flex-col justify-between overflow-hidden rounded-lg border-l-4 p-2 pl-4 ${
          tone.bg
        } ${tone.border} ${tone.extra ?? ""}`}
      >
        <h3 className={`text-xs font-bold ${tone.title}`}>
          {session.servico || session.tipoServico || "Sessão"}
        </h3>
        <p className={`text-sm font-bold ${tone.text}`}>{session.cliente}</p>
      </div>
    </div>
  );
}