import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../ui/atoms/Button";
import PageHeader from "../../ui/molecules/PageHeader";
import TransactionFormModal from "../../ui/organisms/TransactionFormModal";
import {
  BalanceCard,
  CashflowCards,
  CategoryChart,
  RecentTransactions,
} from "../../ui/organisms/FinanceReport";
import { Plus } from "lucide-react";
import { useFinanceReport } from "../../features/transactions/useFinanceReport";

/**
 * Page: relatório financeiro com saldo, fluxo de caixa, gastos por categoria
 * e transações recentes.
 *
 * @returns {React.ReactElement}
 */
export default function FinanceDashboardPage() {
  const { metrics, transactions, refresh } = useFinanceReport();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const navigate = useNavigate();

  const closeForm = () => {
    setIsFormOpen(false);
    refresh();
  };

  return (
    <main className="h-full w-full overflow-auto bg-[#000C24] p-6 text-white">
      <PageHeader
        title="RELATÓRIO FINANCEIRO"
        actions={
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus size={20} /> Nova Transação
          </Button>
        }
      />

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <BalanceCard metrics={metrics} />
        <CashflowCards metrics={metrics} />
        <CategoryChart expenses={metrics?.gastosPorCategoria} />
        <RecentTransactions
          transactions={transactions}
          onSeeAll={() => navigate("/transacoes")}
          onCreate={() => setIsFormOpen(true)}
        />
      </div>

      <TransactionFormModal
        key={isFormOpen ? "aberto" : "fechado"}
        isOpen={isFormOpen}
        onClose={closeForm}
        onSaved={refresh}
      />
    </main>
  );
}