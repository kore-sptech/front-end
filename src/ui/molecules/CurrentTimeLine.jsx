import { ROW_HEIGHT_PX } from "../../constants/scheduling";
import { useEffect, useState } from "react";

/**
 * Molecule: linha do horário atual na grade semanal (atualiza a cada minuto).
 */
export default function CurrentTimeLine({ now: providedNow }) {
  const [now, setNow] = useState(() => providedNow ?? new Date());

  useEffect(() => {
    if (providedNow) return undefined;

    const interval = setInterval(() => setNow(new Date()), 60_000);

    return () => clearInterval(interval);
  }, [providedNow]);

  const topPx = (now.getHours() + now.getMinutes() / 60) * ROW_HEIGHT_PX;

  return (
    <div
      className="pointer-events-none absolute right-0 left-0 z-20 flex items-center"
      style={{ top: topPx }}
    >
      <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#48DCFC] shadow-[0_0_6px_2px_rgba(72,220,252,0.5)]" />
      <div className="h-px w-full bg-[#48DCFC] shadow-[0_0_6px_2px_rgba(72,220,252,0.3)]" />
    </div>
  );
}