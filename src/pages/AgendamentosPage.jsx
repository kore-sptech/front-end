// ─── Dependências ────────────────────────────────────────────────────────────
import { CalendarPlus, CirclePlus, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import "react-day-picker/style.css";

import AsideBar from "../components/Aside";

import {
  differenceInHours,
  isBefore,
  startOfWeek,
  addDays,
  isSameDay,
  setHours,
  setMinutes,
  isAfter,
} from "date-fns";

function buildWeekDays(referenceDate) {
  const monday = startOfWeek(referenceDate, { weekStartsOn: 1 }); // semana começa na SEG
  const labels = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];

  return labels.map((label, i) => {
    const date = addDays(monday, i);
    return {
      label,
      day: date.getDate(), // número do dia para exibir
      date, // Date completo para comparações
    };
  });
}

import { formatCurrecy } from "../utils/formmaters";

// ─── Constantes ──────────────────────────────────────────────────────────────

const ROW_HEIGHT_PX = 60;

const CLIENT_COLORS = [
  "blue",
  "ghost",
  "orange",
  "green",
  "purple",
  "pink",
  "indigo",
  "teal",
];

const COLOR_STYLES = {
  green: {
    bg: "bg-[#3F7334]/20",
    border: "border-[#8FFFA8]",
    title: "text-[#8FFFA8]",
    text: "text-[#DAE2FF]",
  },
  purple: {
    bg: "bg-[#344573]/20",
    border: "border-[#B4C5FB]",
    title: "text-[#B4C5FB]",
    text: "text-[#B4C5FB]",
  },
  orange: {
    bg: "bg-[#22263E]",
    border: "border-[#F99844]",
    title: "text-[#FFBD8B]",
    text: "text-[#DAE2FF]",
  },
  blue: {
    bg: "bg-[#0A1F4B]",
    border: "border-[#48DCFC]",
    title: "text-[#48DCFC]",
    text: "text-[#DAE2FF]",
  },
  ghost: {
    bg: "bg-[#122348]",
    border: "border-[#B4C5FB]",
    title: "text-[#DAE2FF]",
    text: "text-[#DAE2FF]",
    extra: "opacity-50",
  },
  pink: {
    bg: "bg-[#4A1942]/20",
    border: "border-[#FF8EE8]",
    title: "text-[#FF8EE8]",
    text: "text-[#DAE2FF]",
  },
  indigo: {
    bg: "bg-[#1E1B4B]/20",
    border: "border-[#A5B4FC]",
    title: "text-[#A5B4FC]",
    text: "text-[#DAE2FF]",
  },
  teal: {
    bg: "bg-[#0F2E2E]/20",
    border: "border-[#2DD4BF]",
    title: "text-[#2DD4BF]",
    text: "text-[#DAE2FF]",
  },
};

const WEEK_DAYS = [
  { label: "SEG", day: 1 },
  { label: "TER", day: 2 },
  { label: "QUA", day: 3 },
  { label: "QUI", day: 4 },
  { label: "SEX", day: 5 },
  { label: "SAB", day: 6 },
  { label: "DOM", day: 7 },
];

const DAY_LABEL_BY_INDEX = {
  0: "SEG",
  1: "TER",
  2: "QUA",
  3: "QUI",
  4: "SEX",
  5: "SAB",
  6: "DOM",
};

const DAY_COLUMN_INDEX = {
  SEG: 0,
  TER: 1,
  QUA: 2,
  QUI: 3,
  SEX: 4,
  SAB: 5,
  DOM: 6,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Atribui uma cor fixa por cliente (ordem alfabética → sempre estável) */
function buildColorMapByClient(sessions) {
  return [...new Set(sessions.map((s) => s.cliente))]
    .sort()
    .reduce((map, name, i) => {
      map[name] = CLIENT_COLORS[i % CLIENT_COLORS.length];
      return map;
    }, {});
}

// ─── Dados de exemplo ─────────────────────────────────────────────────────────
// Usa addHours para evitar mutação em cascata do objeto Date

function buildSampleSessions(referenceDate = new Date()) {
  // Pega a segunda-feira da semana da data selecionada
  const monday = startOfWeek(referenceDate, { weekStartsOn: 1 });

  // Helper: cria um Date para um dia+hora específico da semana
  const at = (dayOffset, hour, minute = 0) =>
    setMinutes(setHours(addDays(monday, dayOffset), hour), minute);

  return [
    {
      id: 1,
      servico: "Tatuagem",
      preco: 850.0,
      cliente: "Thiago Silva",
      telefone: "11999990001",
      formaPagamento: "DINHEIRO",
      inicio: at(0, 8), // SEG 08:00
      fim: at(0, 10), // SEG 10:00
    },
    {
      id: 2,
      servico: "Tatuagem",
      preco: 320.0,
      cliente: "Bruno Lima",
      telefone: "11999990002",
      formaPagamento: "PIX",
      inicio: at(1, 9), // TER 09:00
      fim: at(1, 11, 30), // TER 11:30
    },
    {
      id: 3,
      servico: "Tatuagem",
      preco: 850.0,
      cliente: "Thiago Silva",
      telefone: "11999990001",
      formaPagamento: "DINHEIRO",
      inicio: at(2, 9), // QUA 09:00
      fim: at(2, 12), // QUA 12:00
    },
    {
      id: 4,
      servico: "Consulta",
      preco: 0.0,
      cliente: "Ana Paula",
      telefone: "11999990003",
      formaPagamento: "CONSULTA",
      inicio: at(4, 11), // SEX 11:00
      fim: at(4, 12), // SEX 12:00
    },
    {
      id: 5,
      servico: "Tatuagem",
      preco: 450.0,
      cliente: "Carlos Mota",
      telefone: "11999990004",
      formaPagamento: "PIX",
      inicio: at(5, 14), // SAB 14:00
      fim: at(5, 17), // SAB 17:00
    },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// Página principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function AgendamentoPage() {
  const [selectedDate, setSelectedDate] = useState(new Date()); // ← sobe aqui

  const onChangeDate = (date) => {
    if (date != null && date != undefined && date != "") {
      setSelectedDate(date);
    }
  };

  const weekDays = buildWeekDays(selectedDate); // ← recalcula ao selecionar
  const sessions = buildSampleSessions(selectedDate);
  const colorByClient = buildColorMapByClient(sessions);

  return (
    <main className="h-screen w-full flex bg-[#000C24] text-[#DAE2FF]">
      <AsideBar />

      <section className="flex-grow h-full">
        {/* Cabeçalho da página */}
        <PageHeader />

        {/* Conteúdo principal */}
        <div className="flex px-6 gap-6 flex-grow h-[85%]">
          {/* Painel esquerdo — calendário mensal + lista */}
          <SidePanel
            sessions={sessions}
            colorByClient={colorByClient}
            selectedDate={selectedDate}
            onSelectDate={onChangeDate}
          />

          {/* Painel direito — grade semanal */}
          <WeeklyCalendar
            sessions={sessions}
            colorByClient={colorByClient}
            weekDays={weekDays}
          />
        </div>
      </section>
    </main>
  );
}

// ─── Cabeçalho ───────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <div className="p-6 flex w-full justify-between">
      <h1 className="text-4xl font-bold">AGENDAMENTO</h1>
      <button className="flex gap-2 px-6 py-2.5 bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] text-[#003640] rounded-xl shadow-xl shadow-cyan-500/20 cursor-pointer">
        <CalendarPlus />
        Agendar
      </button>
    </div>
  );
}

// ─── Painel esquerdo ─────────────────────────────────────────────────────────

function SidePanel({ sessions, colorByClient, selectedDate, onSelectDate }) {
  return (
    <div className="flex-grow h-full">
      <MiniCalendar selected={selectedDate} onSelect={onSelectDate} />
      <h2 className="font-semibold text-lg mb-3">Proximas Sessões</h2>
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
      {sessions.map((session) => (
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
  const hoursUntil = differenceInHours(new Date(session.inicio), new Date());
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

// ─── Grade semanal ────────────────────────────────────────────────────────────

function WeeklyCalendar({ sessions, colorByClient, weekDays }) {
  const scrollRef = useRef(null);

  // Ao montar, rola para o horário atual centralizado na viewport
  useEffect(() => {
    if (!scrollRef.current) return;
    const now = new Date();
    const currentTop = (now.getHours() + now.getMinutes() / 60) * ROW_HEIGHT_PX;
    const offset = scrollRef.current.clientHeight / 2;
    scrollRef.current.scrollTop = Math.max(0, currentTop - offset);
  }, []);

  return (
    <section className="flex-grow h-full w-full flex flex-col border border-[#3C494D]/10 rounded-3xl bg-[#0A1A3D] overflow-hidden">
      {/* Cabeçalho fixo com dias da semana */}
      <WeekHeader weekDays={weekDays} />

      {/* Corpo scrollável */}
      <div
        ref={scrollRef}
        className="flex overflow-y-auto flex-grow      [&::-webkit-scrollbar]:w-1
            [&::-webkit-scrollbar-track]:rounded-full 
            [&::-webkit-scrollbar-track]:bg-[#48DCFC]/20 
            [&::-webkit-scrollbar-thumb]:rounded-full 
            [&::-webkit-scrollbar-thumb]:bg-[#48DCFC] 
            hover:[&::-webkit-scrollbar-thumb]:bg-[#48DCFC]"
      >
        <TimeColumn />
        <EventsGrid sessions={sessions} colorByClient={colorByClient} />
      </div>
    </section>
  );
}

// ─── Cabeçalho da semana ─────────────────────────────────────────────────────

function WeekHeader({ weekDays }) {
  const today = new Date();

  return (
    <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-[#3C494D]/10 shrink-0 rounded-t-3xl overflow-hidden">
      {/* Ícone de relógio no canto */}
      <div className="flex justify-center items-center bg-[#1A294C]/50 border-r border-[#3C494D]/10 p-3">
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

function WeekDayCell({ label, day, isActive, isLast }) {
  return (
    <div
      className={`flex justify-center items-center flex-col border-b border-r border-[#3C494D]/10 bg-[#1A294C]/50 py-2
        ${isLast ? "rounded-tr-3xl" : ""}`}
    >
      <p
        className={`font-bold text-xs ${isActive ? "text-[#48DCFC]" : "text-[#BBC9CD]"}`}
      >
        {label}
      </p>
      <p className="font-bold text-lg">{String(day).padStart(2, "0")}</p>
    </div>
  );
}

// ─── Coluna de horas ──────────────────────────────────────────────────────────

function TimeColumn() {
  const times = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`,
  );

  return (
    <div className="w-[80px] shrink-0 flex flex-col">
      {times.map((time) => (
        <TimeSlot key={time}>{time}</TimeSlot>
      ))}
    </div>
  );
}

function TimeSlot({ children }) {
  return (
    <div
      className="flex justify-center pt-4 border-b border-r border-[#3C494D]/10"
      style={{ minHeight: ROW_HEIGHT_PX }}
    >
      <p className="font-bold text-sm text-[#BBC9CD]/40">{children}</p>
    </div>
  );
}

// ─── Grade de eventos ─────────────────────────────────────────────────────────

function EventsGrid({ sessions, colorByClient }) {
  return (
    <div className="relative flex-grow grid grid-cols-7">
      {/* Células de fundo da grade (24h × 7 dias) */}
      {Array.from({ length: 24 * 7 }, (_, i) => (
        <div
          key={i}
          className="border-b border-r border-[#3C494D]/10"
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

function CurrentTimeLine() {
  const [now, setNow] = useState(new Date());

  // Atualiza a cada minuto
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const topPx = (now.getHours() + now.getMinutes() / 60) * ROW_HEIGHT_PX;

  return (
    <div
      className={`absolute left-0 right-0 z-20 flex items-center pointer-events-none`}
      style={{ top: topPx }}
    >
      {/* Bolinha indicadora no lado esquerdo */}
      <div className="w-2.5 h-2.5 rounded-full bg-[#48DCFC] shrink-0 shadow-[0_0_6px_2px_rgba(72,220,252,0.5)]" />
      {/* Linha */}
      <div className=" h-px bg-[#48DCFC] shadow-[0_0_6px_2px_rgba(72,220,252,0.3)] w-full" />
    </div>
  );
}

// ─── Bloco de evento ──────────────────────────────────────────────────────────

function EventBlock({ session, color, startHour, durationHours, dayLabel }) {
  let style = COLOR_STYLES[color] ?? COLOR_STYLES.ghost;
  const dayIndex = DAY_COLUMN_INDEX[dayLabel] ?? 0;

  if (isAfter(new Date(session.inicio), new Date())) {
    style = COLOR_STYLES.ghost;
  }

  return (
    <div
      className="absolute p-1 z-10"
      style={{
        top: startHour * ROW_HEIGHT_PX,
        height: durationHours * ROW_HEIGHT_PX,
        width: "calc(100% / 7)",
        left: `calc(100% / 7 * ${dayIndex})`,
      }}
    >
      <div
        className={`w-full h-full ${style.bg} rounded-lg p-2 pl-4 border-l-4 ${style.border}
          flex flex-col justify-between cursor-pointer ${style.extra ?? ""}`}
      >
        <h3 className={`text-xs font-bold ${style.title}`}>
          {session.servico}
        </h3>
        <p className={`text-sm font-bold ${style.text}`}>{session.cliente}</p>
      </div>
    </div>
  );
}
