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

// ── CSS injetado uma vez no <head> — único jeito confiável de vencer
//    a especificidade interna do react-day-picker v9
const CALENDAR_STYLES = `
  .kore-calendar .rdp-day_button[aria-selected="true"],
  .kore-calendar td[aria-selected="true"] .rdp-day_button,
  .kore-calendar .rdp-selected .rdp-day_button {
    background: linear-gradient(135deg, #48DCFC, #0CC0DF) !important;
    color: #003640 !important;
    font-weight: 800 !important;
    border-radius: 9999px !important;
    box-shadow: 0 2px 14px rgba(72, 220, 252, 0.4) !important;
    border: none !important;
  }
 
  .kore-calendar .rdp-today:not([aria-selected="true"]) .rdp-day_button {
    color: #48DCFC !important;
    font-weight: 700 !important;
  }
 
  .kore-calendar .rdp-day_button:hover:not([aria-selected="true"]):not([disabled]) {
    background: rgba(72, 220, 252, 0.1) !important;
    color: #48DCFC !important;
    border-radius: 9999px !important;
  }
`;

function injectStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById("kore-calendar-styles")) return;
  const tag = document.createElement("style");
  tag.id = "kore-calendar-styles";
  tag.textContent = CALENDAR_STYLES;
  document.head.appendChild(tag);
}

export function MiniCalendar({ selected, onSelect }) {
  injectStyles();

  return (
    <DayPicker
      className="kore-calendar mb-6"
      animate
      mode="single"
      selected={selected}
      onSelect={onSelect}
      locale={ptBR}
      weekStartsOn={1}
      styles={{
        root: {
          "--rdp-accent-color": "#48DCFC",
          "--rdp-accent-background-color": "rgba(72,220,252,0.1)",
          color: "#E5E7EB",
          background: "transparent",
          fontFamily: "inherit",
        },
        month_caption: {
          color: "#F9FAFB",
          fontWeight: "700",
          fontSize: "0.85rem",
          letterSpacing: "0.04em",
          textTransform: "capitalize",
          paddingBottom: "0.5rem",
        },
        nav: { gap: "4px" },
        button_previous: {
          color: "#48DCFC",
          background: "transparent",
          border: "1px solid #1f2937",
          borderRadius: "8px",
          width: "28px",
          height: "28px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        button_next: {
          color: "#48DCFC",
          background: "transparent",
          border: "1px solid #1f2937",
          borderRadius: "8px",
          width: "28px",
          height: "28px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        weekdays: {
          color: "#fff",
          fontSize: "0.70rem",
          fontWeight: "700",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        },
        day: {
          borderRadius: "9999px",
          fontSize: "0.8rem",
          color: "#9CA3AF",
          fontWeight: "500",
        },
        outside: { color: "#1f2937", opacity: "0.5" },
        disabled: { color: "#1f2937", opacity: "0.3" },
      }}
      classNames={{
        chevron: "fill-[#48DCFC]",
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
        .slice(0, 5)
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
          {formatCurrecy(session.preco)}
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
