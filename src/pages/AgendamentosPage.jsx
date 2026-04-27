import "react-day-picker/style.css";

import { buildColorMapByClient, buildWeekDays } from "../utils/build";
import { useEffect, useState } from "react";

import AsideBar from "../components/Aside";
import { CalendarPlus } from "lucide-react";
import { ModalAgendamentoContextProvider } from "../context/ModalAgendamentoContext";
import ModalNovoAgendamento from "../components/ModalNovoAgendamento";
import { SidePanel } from "../components/SidePainel";
import { WeeklyCalendar } from "../components/WeeklyCalendar";
import { api } from "../utils/api";
import { toast } from "sonner";

export default function AgendamentoPage() {
  const [selectedDate, setSelectedDate] = useState(new Date()); // ← sobe aqui
  const [sessions, setSessions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onOpenModal = () => setIsModalOpen(true);

  const onCloseModal = () => setIsModalOpen(false);

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
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
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
    <ModalAgendamentoContextProvider>
      <main className="flex h-screen w-full bg-[#000C24] text-[#DAE2FF]">
        <AsideBar />

        <section className="h-full grow">
          {/* Cabeçalho da página */}
          <PageHeader onOpenModal={onOpenModal} />

          {/* Conteúdo principal */}
          <div className="flex h-[85%] grow gap-6 px-6">
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

        <ModalNovoAgendamento isOpen={isModalOpen} onClose={onCloseModal} />
      </main>
    </ModalAgendamentoContextProvider>
  );
}

// ─── Cabeçalho ───────────────────────────────────────────────────────────────

function PageHeader({ onOpenModal }) {
  return (
    <div className="flex w-full justify-between p-6">
      <h1 className="text-4xl font-bold">AGENDAMENTO</h1>
      <button
        className="flex cursor-pointer gap-2 rounded-xl bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] px-6 py-2.5 text-[#003640] shadow-xl shadow-cyan-500/20"
        onClick={onOpenModal}
      >
        <CalendarPlus />
        Agendar
      </button>
    </div>
  );
}
