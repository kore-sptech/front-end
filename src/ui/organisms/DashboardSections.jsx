import {
  DASHBOARD_KPIS,
  CRITICAL_STOCK_ALERTS,
  MONTHLY_REVENUE,
  RECENT_ACTIVITIES,
} from "../../features/dashboard/dashboardData";
import ActivityNotification from "../molecules/ActivityNotification";
import CriticalStockAlert from "../molecules/CriticalStockAlert";
import MetricCard from "../molecules/MetricCard";
import Panel from "../molecules/Panel";
import RevenueChart from "./RevenueChart";

/**
 * Organism: indicadores do dashboard geral.
 *
 * @returns {React.ReactElement}
 */
export function DashboardKpis() {
  return (
    <div className="grid grid-cols-1 gap-5 px-5 md:grid-cols-3">
      {DASHBOARD_KPIS.map(({ id, label, value, description, icon: Icon }) => (
        <MetricCard
          key={id}
          label={label}
          value={value}
          description={description}
          icon={Icon ? <Icon className="h-8 w-8" /> : null}
        />
      ))}
    </div>
  );
}

/**
 * Organism: gráfico de receita do mês ao lado dos itens críticos.
 *
 * @returns {React.ReactElement}
 */
export function DashboardRevenueAndAlerts() {
  return (
    <div className="mt-10 mb-5 grid w-full grid-cols-1 gap-5 px-5 lg:grid-cols-3">
      <Panel
        title="Receita total do mês"
        className="col-span-2 text-xs font-bold text-white"
        bodyClassName="px-1"
      >
        <RevenueChart data={MONTHLY_REVENUE} />
      </Panel>

      <Panel
        title={<span className="font-bold">Itens críticos</span>}
        className="text-white"
        bodyClassName="max-h-75 overflow-y-auto px-2.5"
      >
        {CRITICAL_STOCK_ALERTS.map((alert) => (
          <CriticalStockAlert
            key={alert.id}
            title={alert.title}
            description={alert.description}
          />
        ))}
      </Panel>
    </div>
  );
}

/**
 * Organism: feed de atividades recentes.
 *
 * @param {object} props
 * @param {() => void} [props.onClear]
 * @returns {React.ReactElement}
 */
export function DashboardActivityFeed({ onClear }) {
  return (
    <div className="mb-10 grid grid-cols-3 gap-5 px-5">
      <Panel
        title={<span className="font-bold">Notificações</span>}
        className="col-span-3 text-white"
        actions={
          onClear && (
            <button
              type="button"
              onClick={onClear}
              className="flex cursor-pointer flex-col justify-around p-2 text-sm text-blue-300"
            >
              Limpar notificações
            </button>
          )
        }
        bodyClassName="flex max-h-75 flex-col items-center overflow-y-auto"
      >
        {RECENT_ACTIVITIES.map((activity) => (
          <ActivityNotification
            key={activity.id}
            icon={activity.icon}
            tipo={activity.tipo}
            title={activity.title}
            description={activity.description}
            time={activity.time}
          />
        ))}
      </Panel>
    </div>
  );
}