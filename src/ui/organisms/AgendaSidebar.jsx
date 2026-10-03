import { differenceInHours, differenceInMinutes } from "date-fns";

import EmptyState from "../molecules/EmptyState";
import MiniCalendar from "../molecules/MiniCalendar";
import SessionCardRow from "../molecules/SessionCardRow";
import { resolveSessionTone } from "../../constants/scheduling";

const MAX_UPCOMING = 5;

/**
 * Distância legível até o início da sessão ("Em 2 horas", "Em 40 minutos").
 *
 * @param {object} session
 * @returns {number} Quantidade de horas (ou minutos, quando < 1h).
 */
function countdownAmount(session) {
  const start = new Date(session.inicio);
  const hoursUntil = differenceInHours(start, new Date());

  return hoursUntil === 0 ? differenceInMinutes(start, new Date()) : hoursUntil;
}

/**
 * Organism: painel lateral da agenda (calendário mensal + próximas sessões).
 *
 * @param {object} props
 * @param {object[]} props.sessions
 * @param {Date} props.selectedDate
 * @param {(date: Date) => void} props.onSelectDate
 * @param {(session: object) => void} [props.onSelectSession]
 */
export default function AgendaSidebar({
  sessions = [],
  selectedDate,
  onSelectDate,
  onSelectSession,
}) {
  const upcoming = sessions
    .filter((session) => new Date(session.inicio) > new Date())
    .slice(0, MAX_UPCOMING);

  return (
    <aside className="h-full grow">
      <MiniCalendar selected={selectedDate} onSelect={onSelectDate} />

      <h2 className="mb-3 text-lg font-semibold">Proximas Sessões</h2>

      {upcoming.length === 0 ? (
        <EmptyState
          description="Nenhuma sessão agendada."
          className="py-6 text-base"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {upcoming.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => onSelectSession?.(session)}
              className="text-left"
            >
              <SessionCardRow
                cliente={session.cliente}
                formaPagamento={session.formaPagamento}
                preco={session.preco}
                hoursUntil={countdownAmount(session)}
                tone={resolveSessionTone(session.status)}
              />
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}