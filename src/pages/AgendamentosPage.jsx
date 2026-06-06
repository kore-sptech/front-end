import "react-day-picker/style.css";

import {
  AgendamentoContext,
  ModalAgendamentoContextProvider,
} from "../context/ModalAgendamentoContext";
import { buildColorMapByClient, buildWeekDays } from "../utils/build";
import { useContext, useEffect, useState } from "react";

import { CalendarPlus } from "lucide-react";
import ModalNovoAgendamento from "../components/ModalNovoAgendamento";
import { SidePanel } from "../components/SidePainel";
import Sidebar from "../components/Sidebar";
import { WeeklyCalendar } from "../components/WeeklyCalendar";
import { api } from "../utils/api";
import { toast } from "sonner";

export default function AgendamentoPage() {
  const [selectedDate, setSelectedDate] = useState(new Date()); // ← sobe aqui
  const [sessions, setSessions] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const onOpenModal = () => setIsModalOpen(true);

  const { isOpen, agendamento } = useContext(AgendamentoContext);

  const onCloseModal = () => {
    console.log("------------------------Modal closed------------------------");
    setIsModalOpen(false);
  };

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

    let initialDate = new Date(primaryDay.date);
    initialDate = initialDate.setHours(0, 0, 0, 0);
    initialDate = new Date(initialDate);

    let finalDate = new Date(lastDay.date);
    finalDate = finalDate.setHours(23, 59, 59, 999);
    finalDate = new Date(finalDate);

    const url = `agendamentos?inicio=${initialDate.toISOString()}&fim=${finalDate.toISOString()}`;

    console.log(`Fetching sessions for ${selectedDate.toDateString()}`);

    api
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(`Sessions for ${selectedDate.toDateString()}:`);
        console.log(response.data);
        setSessions(response.data);
      })
      .catch(() => {
        toast.error("Erro ao carregar os agendamentos");
      });
  };

  useEffect(() => {
    fetchSessions();
  }, [selectedDate]);

  useEffect(() => {
    console.log({
      isOpen,
      agendamento,
    });
    if (!isOpen && agendamento == null) {
      fetchSessions();
    }
  }, [isOpen]);

  return (
    <main className="flex h-screen w-full bg-[#000C24] text-[#DAE2FF]">
      <Sidebar />

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
  );
}

// ─── Cabeçalho ───────────────────────────────────────────────────────────────

function PageHeader({ onOpenModal }) {
  return (
    <div className="flex w-full justify-between p-6">
      <h1 className="text-4xl font-bold">AGENDAMENTO</h1>
      <button
        className="flex cursor-pointer gap-2 rounded-xl bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] px-6 py-2.5 font-bold text-[#003640] shadow-xl shadow-cyan-500/20"
        onClick={onOpenModal}
      >
        <CalendarPlus />
        Agendar
      </button>
    </div>
  );
}
