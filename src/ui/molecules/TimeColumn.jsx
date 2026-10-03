import { TOTAL_HOURS } from "../../constants/scheduling";
import { ROW_HEIGHT_PX } from "../../constants/scheduling";

/**
 * Molecule: coluna de horas da grade semanal.
 */
export default function TimeColumn() {
  const times = Array.from(
    { length: TOTAL_HOURS },
    (_, hour) => `${String(hour).padStart(2, "0")}:00`,
  );

  return (
    <div className="flex w-20 shrink-0 flex-col">
      {times.map((time) => (
        <div
          key={time}
          className="flex justify-center border-r border-b border-[#3C494D]/10 pt-4"
          style={{ minHeight: ROW_HEIGHT_PX }}
        >
          <p className="text-sm font-bold text-[#BBC9CD]/40">{time}</p>
        </div>
      ))}
    </div>
  );
}