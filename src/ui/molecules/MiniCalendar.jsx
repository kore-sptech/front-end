import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";

const STYLE_ID = "kore-calendar-styles";

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

const STYLES = {
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
};

const injectStyles = () => {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;

  const tag = document.createElement("style");

  tag.id = STYLE_ID;
  tag.textContent = CALENDAR_STYLES;
  document.head.appendChild(tag);
};

/**
 * Molecule: calendário mensal compacto (seleção de dia da semana exibida).
 * O CSS é injetado uma única vez para vencer a especificidade interna do
 * `react-day-picker`.
 *
 * @param {object} props
 * @param {Date} props.selected
 * @param {(date: Date) => void} props.onSelect
 */
export default function MiniCalendar({ selected, onSelect }) {
  injectStyles();

  return (
    <DayPicker
      className="kore-calendar mb-6"
      animate
      mode="single"
      selected={selected}
      onSelect={(date) => date && onSelect?.(date)}
      locale={ptBR}
      weekStartsOn={1}
      styles={STYLES}
      classNames={{ chevron: "fill-[#48DCFC]" }}
    />
  );
}