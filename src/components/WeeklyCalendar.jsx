import {
  COLOR_STYLES,
  DAY_COLUMN_INDEX,
  DAY_LABEL_BY_INDEX,
  ROW_HEIGHT_PX,
} from "../const/Day";
import { Clock, X } from "lucide-react";
import { differenceInHours, differenceInMinutes, isSameDay } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";

import { AgendamentoContext } from "../context/ModalAgendamentoContext";
import { api } from "../utils/api";
import toast from "react-hot-toast";

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
    <div
      className="relative grid grow grid-cols-7"
      style={{ height: 24 * ROW_HEIGHT_PX }} // ← altura total explícita: 1440px
    >
      {/* Células de fundo da grade (24h × 7 dias) */}
      {Array.from({ length: 24 * 7 }, (_, i) => (
        <div
          key={i}
          className="border-r border-b border-[#3C494D]/35"
          style={{ minHeight: ROW_HEIGHT_PX }}
        />
      ))}

      {/* Linha do horário atual */}
      <CurrentTimeLine />

      {/* Blocos de agendamento sobrepostos */}
      {sessions.map((session) => {
        return (
          <EventBlock
            key={session.id}
            session={session}
            color={colorByClient[session.cliente]}
            startHour={
              new Date(session.inicio).getHours() +
              new Date(session.inicio).getMinutes() / 60
            }
            durationHours={
              differenceInMinutes(
                new Date(session.fim),
                new Date(session.inicio),
              ) / 60
            }
            dayLabel={DAY_LABEL_BY_INDEX[new Date(session.inicio).getDay()]}
          />
        );
      })}
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
export function EventBlock({ session, startHour, durationHours, dayLabel }) {
  const { openModal } = useContext(AgendamentoContext);

  let style = COLOR_STYLES.ghost;
  let dayIndex = DAY_COLUMN_INDEX[dayLabel];

  if (session.status === "CONFIRMADO_PAGAMENTO") style = COLOR_STYLES.green;
  else if (session.status === "CONFIRMADO") style = COLOR_STYLES.blue;
  else if (session.status == "AGUARDANDO") style = COLOR_STYLES.orange;
  else if (session.status === "PENDENTE") style = COLOR_STYLES.ghost;
  else if (session.status === "CANCELADO") style = COLOR_STYLES.red;

  console.log(session);

  return (
    // ↓ "group" habilita o group-hover nos filhos
    // ↓ overflow-visible (não mais overflow-hidden) para o X não ser cortado
    <div
      className="group absolute z-10 p-0.5"
      style={{
        top: startHour * ROW_HEIGHT_PX,
        height: durationHours * ROW_HEIGHT_PX,
        minHeight: durationHours * ROW_HEIGHT_PX,
        width: "calc(100% / 7)",
        left: `calc(100% / 7 * ${dayIndex})`,
      }}
    >
      {/* Botão X — invisível por padrão, aparece no hover do grupo */}
      {session.status == "PENDENTE" && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // não abre o modal ao cancelar
            console.log("cancelar", session.id);
            document.getElementById(`my_modal2_${session.id}`).showModal();

            // sua lógica de cancelamento aqui
          }}
          className="absolute top-1.5 right-1.5 z-30 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full bg-[#0A1F4B] text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
        >
          <X size={10} strokeWidth={3} />
        </button>
      )}

      {/* Card do evento */}
      <div
        className={`h-full w-full overflow-hidden ${style.bg} rounded-lg border-l-4 p-2 pl-4 ${style.border} flex cursor-pointer flex-col justify-between ${style.extra ?? ""} `}
        onClick={() => openModal(session)}
      >
        <h3 className={`text-xs font-bold ${style.title}`}>
          {session.servico}
        </h3>
        <p className={`text-sm font-bold ${style.text}`}>{session.cliente}</p>
      </div>

      <dialog id={`my_modal2_${session.id}`} className="modal">
        <div className="modal-box bg-[#0A1F4B]">
          <h2 className="text-lg font-bold">
            Cancelar Serviço do {session.cliente}
          </h2>
          <p className="py-4 text-sm font-light">
            Tem certeza que deseja cancelar o agendamento?
            <br />
            <br />
            <span className="font-bold text-[#48DCFC]">Atenção:</span> Essa ação
            é permanente e não pode ser desfeita.
          </p>
          <div className="modal-action">
            <form method="dialog ">
              {/* if there is a button in form, it will close the modal */}

              <div className="flex gap-4">
                <button
                  onClick={(ev) => {
                    ev.preventDefault();
                    document.getElementById(`my_modal2_${session.id}`).close();
                  }}
                  className="flex cursor-pointer gap-2 rounded-xl border border-[#48DCFC] px-6 py-2.5 font-normal text-[#48DCFC]"
                >
                  Cancelar
                </button>

                <button
                  className="flex cursor-pointer gap-2 rounded-xl bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] px-6 py-2.5 font-normal text-[#003640] opacity-65 shadow-xl transition-all hover:opacity-100 hover:shadow-cyan-500/20"
                  onClick={(ev) => {
                    ev.preventDefault();

                    api
                      .patch(
                        `/agendamentos/cancelar/${session.id}`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                          },
                        },
                      )
                      .then(() => {
                        toast.success("Agendamento cancelado com sucesso!");
                        window.location.reload();
                      })
                      .catch(() => {
                        toast.error("Erro ao cancelar agendamento.");
                      });
                  }}
                >
                  Confirmar
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
