import { differenceInMinutes } from "date-fns";
import { useEffect, useRef } from "react";

import CurrentTimeLine from "../molecules/CurrentTimeLine";
import SessionEventBlock from "../molecules/SessionEventBlock";
import TimeColumn from "../molecules/TimeColumn";
import WeekHeader from "../molecules/WeekHeader";
import {
  DAY_COLUMN_INDEX,
  DAY_LABEL_BY_INDEX,
  ROW_HEIGHT_PX,
  TOTAL_HOURS,
  resolveSessionTone,
} from "../../constants/scheduling";

/**
 * Organism: grade semanal (24h × 7 dias) com blocos de sessão posicionados
 * por horário, rolagem automática até o momento atual e linha do "agora".
 *
 * @param {object} props
 * @param {object[]} props.sessions Agendamentos da semana visível.
 * @param {Array<{label: string, day: number, date: Date}>} props.weekDays
 * @param {(session: object) => void} props.onSelectSession
 * @param {(session: object) => void} [props.onRequestCancel]
 */
export default function WeekCalendar({
  sessions = [],
  weekDays = [],
  onSelectSession,
  onRequestCancel,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    const now = new Date();
    const currentTop = (now.getHours() + now.getMinutes() / 60) * ROW_HEIGHT_PX;

    scrollRef.current.scrollTop = Math.max(
      0,
      currentTop - scrollRef.current.clientHeight / 2,
    );
  }, []);

  return (
    <section className="flex h-full w-full grow flex-col overflow-hidden rounded-3xl border border-[#3C494D]/10 bg-[#0A1A3D]">
      <WeekHeader weekDays={weekDays} />

      <div
        ref={scrollRef}
        className="flex grow overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#48DCFC] hover:[&::-webkit-scrollbar-thumb]:bg-[#48DCFC] [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#48DCFC]/20"
      >
        <TimeColumn />

        <div
          className="relative grid grow grid-cols-7"
          style={{ height: TOTAL_HOURS * ROW_HEIGHT_PX }}
        >
          {Array.from({ length: TOTAL_HOURS * 7 }, (_, index) => (
            <div
              key={index}
              className="border-r border-b border-[#3C494D]/35"
              style={{ minHeight: ROW_HEIGHT_PX }}
            />
          ))}

          <CurrentTimeLine />

          {sessions.map((session) => {
            const start = new Date(session.inicio);
            const end = new Date(session.fim);

            return (
              <SessionEventBlock
                key={session.id}
                session={session}
                tone={resolveSessionTone(session.status)}
                startHour={start.getHours() + start.getMinutes() / 60}
                durationHours={
                  differenceInMinutes(end, start) / 60 || 0.5
                }
                column={DAY_COLUMN_INDEX[DAY_LABEL_BY_INDEX[start.getDay()]] ?? 0}
                onOpen={() => onSelectSession(session)}
                onCancel={
                  session.status === "PENDENTE" && onRequestCancel
                    ? () => onRequestCancel(session)
                    : undefined
                }
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}