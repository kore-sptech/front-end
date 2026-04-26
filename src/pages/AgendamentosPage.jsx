import "react-day-picker/style.css";

import { buildColorMapByClient, buildWeekDays } from "../utils/build";
import { useEffect, useState } from "react";

import AsideBar from "../components/Aside";
import { CalendarPlus } from "lucide-react";
import { SidePanel } from "../components/SidePainel";
import { WeeklyCalendar } from "../components/WeeklyCalendar";
import { api } from "../utils/api";
import { toast } from "sonner";

export default function AgendamentoPage() {
  const [selectedDate, setSelectedDate] = useState(new Date()); // ← sobe aqui
  const [sessions, setSessions] = useState([]);

  const onChangeDate = (date) => {
    if (date != null && date != undefined && date != "") {
      setSelectedDate(date);
    }
  };

  const weekDays = buildWeekDays(selectedDate);
  const colorByClient = buildColorMapByClient(sessions);

  const fetchSessions = () => {
    const weekDays = buildWeekDays(selectedDate);
    const primaryDay = weekDays[0];
    const lastDay = weekDays[weekDays.length - 1];

    const url = `agendamentos?inicio=${primaryDay.date.toISOString()}&fim=${lastDay.date.toISOString()}`;

    api
      .get(url)
      .then((response) => {
        setSessions(response.data);
      })
      .catch(() => {
        toast.error("Erro ao carregar os agendamentos");
      });
  };

  useEffect(() => {
    fetchSessions();
  }, [selectedDate]);

  return (
    <main className="h-screen w-full flex bg-[#000C24] text-[#DAE2FF]">
      <AsideBar />

      <section className="grow h-full">
        {/* Cabeçalho da página */}
        <PageHeader />

        {/* Conteúdo principal */}
        <div className="flex px-6 gap-6 grow h-[85%]">
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
