import AlertNotification from "../../ui/molecules/AlertNotification";
import FilterChips from "../../ui/molecules/FilterChips";
import PageHeader from "../../ui/molecules/PageHeader";
import Pagination from "../../ui/molecules/Pagination";
import Panel from "../../ui/molecules/Panel";
import Odometer from "react-odometerjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NOTIFICATION_FILTERS } from "../../features/notifications/notifications";
import { useNotificationFeed } from "../../features/notifications/useNotificationFeed";
import { useNotifications } from "../../providers/useNotifications";

const SUMMARY_ROWS = [
  {
    key: "CRITICO",
    label: "Críticos",
    valueClassName: "text-[#F87171]",
  },
  {
    key: "ATENCAO",
    label: "Atenção",
    valueClassName: "text-[#FB923C]",
  },
  {
    key: "INFORMATIVO",
    label: "Informativos",
    valueClassName: "text-[#22D3EE]",
  },
];

/**
 * Organism: resumo de alertas por severidade.
 *
 * @param {object} props
 * @param {{CRITICO: number, ATENCAO: number, INFORMATIVO: number}} props.summary
 * @returns {React.ReactElement}
 */
function AlertSummary({ summary }) {
  return (
    <Panel title="Resumo de Alertas">
      <div className="space-y-4">
        {SUMMARY_ROWS.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between rounded-xl bg-[#021134] px-5 py-4"
          >
            <span
              className={`text-xs font-bold tracking-wider uppercase ${row.valueClassName}`}
            >
              {row.label}
            </span>

            <span className="text-xl font-black text-white">
              <Odometer value={summary[row.key]} duration={5} format="d" />
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/**
 * Page: central de notificações com filtros por severidade e paginação.
 *
 * @returns {React.ReactElement}
 */
export default function NotificationsPage() {
  const { notifications } = useNotifications();

  const {
    visibleItems,
    summary,
    filter,
    total,
    firstItem,
    lastItem,
    totalPages,
    currentPage,
    setFilter,
    setPage,
  } = useNotificationFeed(notifications);

  return (
    <main className="h-full w-full overflow-auto bg-[#000C24] p-6 text-[#DAE2FF]">
      <PageHeader
        title="NOTIFICAÇÕES"
        actions={
          <FilterChips options={NOTIFICATION_FILTERS} value={filter} onChange={setFilter} />
        }
      />

      <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-8">
          {visibleItems.map((notification) => (
            <AlertNotification key={notification.id} alert={notification} />
          ))}
        </div>

        <div className="lg:col-span-4">
          <AlertSummary summary={summary} />
        </div>
      </div>

      <footer className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-gray-800/50 pt-6 text-xs font-semibold tracking-wider text-gray-500 uppercase">
        <div>
          Exibindo {firstItem} - {lastItem} de {total} notificações no sistema
        </div>

        <Pagination
          total={totalPages}
          current={currentPage}
          onChange={setPage}
          previous={<ChevronLeft size={14} />}
          next={<ChevronRight size={14} />}
        />
      </footer>
    </main>
  );
}