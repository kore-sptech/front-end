import { Clock } from "lucide-react";
import { isSameDay } from "date-fns";

/**
 * Molecule: cabeçalho fixo da grade semanal (coluna de horas + sete dias).
 *
 * @param {object} props
 * @param {Array<{label: string, day: number, date: Date}>} props.weekDays
 * @param {Date} [props.today] Data usada para destacar o dia atual.
 */
export default function WeekHeader({ weekDays = [], today = new Date() }) {
  return (
    <div className="grid shrink-0 grid-cols-[80px_repeat(7,1fr)] overflow-hidden rounded-t-3xl border-b border-[#3C494D]/10">
      <div className="flex items-center justify-center border-r border-[#3C494D]/10 bg-[#1A294C]/50 p-3">
        <Clock width={15} height={15} />
      </div>

      {weekDays.map(({ label, day, date }, index) => (
        <div
          key={label}
          className={`flex flex-col items-center justify-center border-r border-b border-[#3C494D]/10 bg-[#1A294C]/50 py-2 ${
            index === weekDays.length - 1 ? "rounded-tr-3xl" : ""
          }`}
        >
          <p
            className={`text-xs font-bold ${
              isSameDay(date, today) ? "text-[#48DCFC]" : "text-[#BBC9CD]"
            }`}
          >
            {label}
          </p>
          <p className="text-lg font-bold">{String(day).padStart(2, "0")}</p>
        </div>
      ))}
    </div>
  );
}