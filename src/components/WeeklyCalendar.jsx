import {
  COLOR_STYLES,
  DAY_COLUMN_INDEX,
  DAY_LABEL_BY_INDEX,
  ROW_HEIGHT_PX,
} from "../const/Day";
import { differenceInHours, isSameDay } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";

import { AgendamentoContext } from "../context/ModalAgendamentoContext";
import { Clock } from "lucide-react";
import { isOld } from "../utils/date";

export function WeeklyCalendar({ sessions, colorByClient, weekDays }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const now = new Date();
    const currentTop = (now.getHours() + now.getMinutes() / 60) * ROW_HEIGHT_PX;
    const offset = scrollRef.current.clientHeight / 2;
    scrollRef.current.scrollTop = Math.max(0, currentTop - offset);
  }, []);

  return (
    <section className="flex h-full w-full grow flex-col overflow-hidden rounded-3xl border border-[#3C494D]/10 bg-[#0A1A3D]">
      {/* Cabeçalho fixo com dias da semana */}
      <WeekHeader weekDays={weekDays} />

      {/* Corpo scrollável */}
      <div
        ref={scrollRef}
        className="flex grow overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#48DCFC] hover:[&::-webkit-scrollbar-thumb]:bg-[#48DCFC] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#48DCFC]/20"
      >
        <TimeColumn />
        <EventsGrid sessions={sessions} colorByClient={colorByClient} />
      </div>
    </section>
  );
}

// ─── Cabeçalho da semana ─────────────────────────────────────────────────────

export function WeekHeader({ weekDays }) {
  const today = new Date();

  return (
    <div className="grid shrink-0 grid-cols-[80px_repeat(7,1fr)] overflow-hidden rounded-t-3xl border-b border-[#3C494D]/10">
      {/* Ícone de relógio no canto */}
      <div className="flex items-center justify-center border-r border-[#3C494D]/10 bg-[#1A294C]/50 p-3">
        <Clock width={15} height={15} />
      </div>

      {/* Colunas dos dias */}
      {weekDays.map(({ label, day, date }, i) => (
        <WeekDayCell
          key={label}
          label={label}
          day={day}
          isActive={isSameDay(date, today)}
          isLast={i === weekDays.length - 1}
        />
      ))}
    </div>
  );
}

export function WeekDayCell({ label, day, isActive, isLast }) {
  return (
    <div
      className={`flex flex-col items-center justify-center border-r border-b border-[#3C494D]/10 bg-[#1A294C]/50 py-2 ${isLast ? "rounded-tr-3xl" : ""}`}
    >
      <p
        className={`text-xs font-bold ${isActive ? "text-[#48DCFC]" : "text-[#BBC9CD]"}`}
      >
        {label}
      </p>
      <p className="text-lg font-bold">{String(day).padStart(2, "0")}</p>
    </div>
  );
}

// ─── Coluna de horas ──────────────────────────────────────────────────────────

export function TimeColumn() {
  const times = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`,
  );

  return (
    <div className="flex w-20 shrink-0 flex-col">
      {times.map((time) => (
        <TimeSlot key={time}>{time}</TimeSlot>
      ))}
    </div>
  );
}

export function TimeSlot({ children }) {
  return (
    <div
      className="flex justify-center border-r border-b border-[#3C494D]/10 pt-4"
      style={{ minHeight: ROW_HEIGHT_PX }}
    >
      <p className="text-sm font-bold text-[#BBC9CD]/40">{children}</p>
    </div>
  );
}

// ─── Grade de eventos ─────────────────────────────────────────────────────────

export function EventsGrid({ sessions, colorByClient }) {
  return (
    <div className="relative grid grow grid-cols-7">
      {/* Células de fundo da grade (24h × 7 dias) */}
      {Array.from({ length: 24 * 7 }, (_, i) => (
        <div
          key={i}
          className="border-r border-b border-[#3C494D]/10"
          style={{ minHeight: ROW_HEIGHT_PX }}
        />
      ))}

      {/* Linha do horário atual */}
      <CurrentTimeLine />

      {/* Blocos de agendamento sobrepostos */}
      {sessions.map((session) => (
        <EventBlock
          key={session.id}
          session={session}
          color={colorByClient[session.cliente]}
          startHour={new Date(session.inicio).getHours()}
          durationHours={differenceInHours(
            new Date(session.fim),
            new Date(session.inicio),
          )}
          dayLabel={DAY_LABEL_BY_INDEX[new Date(session.inicio).getDay()]}
        />
      ))}
    </div>
  );
}

// ─── Linha de horário atual ───────────────────────────────────────────────────
export function CurrentTimeLine() {
  const [now, setNow] = useState(new Date());

  // Atualiza a cada minuto
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const topPx = (now.getHours() + now.getMinutes() / 60) * ROW_HEIGHT_PX;

  return (
    <div
      className={`pointer-events-none absolute right-0 left-0 z-20 flex items-center`}
      style={{ top: topPx }}
    >
      {/* Bolinha indicadora no lado esquerdo */}
      <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#48DCFC] shadow-[0_0_6px_2px_rgba(72,220,252,0.5)]" />
      {/* Linha */}
      <div className="h-px w-full bg-[#48DCFC] shadow-[0_0_6px_2px_rgba(72,220,252,0.3)]" />
    </div>
  );
}

// ─── Bloco de evento ──────────────────────────────────────────────────────────
export function EventBlock({
  session,
  color,
  startHour,
  durationHours,
  dayLabel,
}) {
  const { openModal } = useContext(AgendamentoContext);

  let style = COLOR_STYLES[color] ?? COLOR_STYLES.ghost;
  const dayIndex = DAY_COLUMN_INDEX[dayLabel] ?? 0;

  if (isOld(session)) {
    style = COLOR_STYLES.ghost;
  }

  return (
    <div
      className="absolute z-10 p-1"
      style={{
        top: startHour * ROW_HEIGHT_PX,
        height: durationHours * ROW_HEIGHT_PX,
        width: "calc(100% / 7)",
        left: `calc(100% / 7 * ${dayIndex - 1})`,
      }}
    >
      <div
        className={`h-full w-full ${style.bg} rounded-lg border-l-4 p-2 pl-4 ${style.border} flex cursor-pointer flex-col justify-between ${style.extra ?? ""}`}
        onClick={() => {
          console.log(session);
          openModal(session);
        }}
      >
        <h3 className={`text-xs font-bold ${style.title}`}>
          {session.servico}
        </h3>
        <p className={`text-sm font-bold ${style.text}`}>{session.cliente}</p>
      </div>
    </div>
  );
}
