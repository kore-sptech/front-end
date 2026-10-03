import "react-day-picker/style.css";

import Button from "../../ui/atoms/Button";
import PageHeader from "../../ui/molecules/PageHeader";
import AgendaSidebar from "../../ui/organisms/AgendaSidebar";
import WeekCalendar from "../../ui/organisms/WeekCalendar";
import { CalendarPlus } from "lucide-react";
import { useSchedulingModal } from "../../providers/useSchedulingModal";
import { useWeekSchedule } from "../../features/scheduling/useWeekSchedule";
import { useEffect } from "react";

/**
 * Page: agenda com calendário mensal, próximas sessões e grade semanal.
 *
 * @returns {React.ReactElement}
 */
export default function SchedulePage() {
  const {
    sessions,
    weekDays,
    selectedDate,
    setSelectedDate,
    refresh,
  } = useWeekSchedule();

  const { openNew, openExisting, savedCount } = useSchedulingModal();

  useEffect(() => {
    if (savedCount > 0) refresh();
  }, [refresh, savedCount]);

  return (
    <main className="flex h-full w-full flex-col bg-[#000C24] p-4 sm:p-6 text-[#DAE2FF]">
      <PageHeader
        title="AGENDAMENTO"
        actions={
          <Button onClick={openNew}>
            <CalendarPlus />
            Agendar
          </Button>
        }
      />

      <div className="flex min-h-0 grow gap-6">
        <AgendaSidebar
          sessions={sessions}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onSelectSession={openExisting}
        />

        <WeekCalendar
          sessions={sessions}
          weekDays={weekDays}
          onSelectSession={openExisting}
        />
      </div>
    </main>
  );
}