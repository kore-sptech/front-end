import { COLOR_STYLES } from "../const/Day";
import { CirclePlus } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { differenceInHours } from "date-fns";
import { formatCurrecy } from "../utils/formmaters";
import { isOld } from "../utils/date";
import { ptBR } from "react-day-picker/locale";

export function SidePanel({
  sessions,
  colorByClient,
  selectedDate,
  onSelectDate,
}) {
  return (
    <div className="grow h-full">
      <MiniCalendar selected={selectedDate} onSelect={onSelectDate} />
      <h2 className="font-semibold text-lg mb-3">Proximas Sessões</h2>

      {sessions.filter((session) => !isOld(session)).length == 0 && (
        <p>Nenhuma sessão agendada.</p>
      )}

      <UpcomingSessionsList sessions={sessions} colorByClient={colorByClient} />
    </div>
  );
}

// ─── Calendário mensal (DayPicker) ────────────────────────────────────────────

function MiniCalendar({ selected, onSelect }) {
  return (
    <DayPicker
      className="mb-6"
      animate
      mode="single"
      selected={selected}
      onSelect={onSelect}
      locale={ptBR}
      classNames={{
        selected: "text-[#0CC0DF]",
        chevron: "fill-[#0CC0DF]",
      }}
    />
  );
}

// ─── Lista de sessões ─────────────────────────────────────────────────────────

function UpcomingSessionsList({ sessions, colorByClient }) {
  return (
    <div className="flex flex-col gap-3">
      {sessions
        .filter((session) => !isOld(session))
        .map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            color={colorByClient[session.cliente]}
          />
        ))}
    </div>
  );
}

function SessionCard({ session, color }) {
  console.log(new Date());
  console.log(new Date(session.inicio));

  const hoursUntil = differenceInHours(new Date(), new Date(session.inicio));
  const style = COLOR_STYLES[color] ?? COLOR_STYLES.ghost;

  return (
    <div
      className={`flex ${style.bg} border-l-4 ${style.border} w-full p-3 justify-between rounded-xl`}
    >
      <div className="flex gap-4 items-center">
        <span className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
          <CirclePlus className={style.title} width={20} height={20} />
        </span>
        <div>
          <h4 className={`font-semibold ${style.title}`}>{session.cliente}</h4>
          <p className="text-xs text-[#BBC9CD] font-normal">
            Em {hoursUntil} horas
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <p className={`font-bold ${style.title}`}>
          {formatCurrecy.format(session.preco)}
        </p>
        <p
          className={`font-bold text-[10px] bg-white/5 px-2 py-1 rounded-full w-fit ${style.title}`}
        >
          {session.formaPagamento}
        </p>
      </div>
    </div>
  );
}
