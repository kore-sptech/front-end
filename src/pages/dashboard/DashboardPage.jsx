import AmbientGlow from "../../ui/molecules/AmbientGlow";
import PageHeader from "../../ui/molecules/PageHeader";
import {
  DashboardActivityFeed,
  DashboardKpis,
  DashboardRevenueAndAlerts,
} from "../../ui/organisms/DashboardSections";
import { useNotifications } from "../../providers/useNotifications";

/**
 * Page: dashboard geral (KPIs, receita, itens críticos e feed de atividades).
 *
 * Os dados desta tela ainda são simulados, conforme o protótipo.
 *
 * @returns {React.ReactElement}
 */
export default function DashboardPage() {
  const { dismissAll } = useNotifications();

  return (
    <main className="relative h-full w-full overflow-x-hidden bg-[#000C24]">
      <AmbientGlow topRight bottomLeft />

      <div className="flex flex-col gap-2 p-6">
        <PageHeader title="DASHBOARD GERAL" />
      </div>

      <div className="flex flex-1 flex-col">
        <DashboardKpis />
        <DashboardRevenueAndAlerts />
        <DashboardActivityFeed onClear={dismissAll} />
      </div>
    </main>
  );
}