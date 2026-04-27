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
    <div className="h-full grow">
      <MiniCalendar selected={selectedDate} onSelect={onSelectDate} />
      <h2 className="mb-3 text-lg font-semibold">Proximas Sessões</h2>

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

  const hoursUntil = differenceInHours(new Date(session.inicio), new Date());
  const style = COLOR_STYLES[color] ?? COLOR_STYLES.ghost;

  return (
    <div
      className={`flex ${style.bg} border-l-4 ${style.border} w-full justify-between rounded-xl p-3`}
    >
      <div className="flex items-center gap-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
          <CirclePlus className={style.title} width={20} height={20} />
        </span>
        <div>
          <h4 className={`font-semibold ${style.title}`}>{session.cliente}</h4>
          <p className="text-xs font-normal text-[#BBC9CD]">
            Em {hoursUntil} horas
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <p className={`font-bold ${style.title}`}>
          {formatCurrecy.format(session.preco)}
        </p>
        <p
          className={`w-fit rounded-full bg-white/5 px-2 py-1 text-[10px] font-bold ${style.title}`}
        >
          {session.formaPagamento}
        </p>
      </div>
    </div>
  );
}
