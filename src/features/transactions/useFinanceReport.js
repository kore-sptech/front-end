import { useCallback, useEffect, useState } from "react";

import { listarMetricas, listarTransacoes } from "../../services/transacoes";
import { handleApiError } from "../../utils/errorHandler";

/**
 * Hook: métricas financeiras e transações recentes do relatório.
 *
 * @returns {object} `metrics`, `transactions` e `refresh`.
 */
export function useFinanceReport() {
  const [metrics, setMetrics] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const loadMetrics = useCallback(() => {
    return listarMetricas()
      .then((response) => setMetrics(response.data))
      .catch((error) =>
        handleApiError(error, "Não foi possível carregar as métricas."),
      );
  }, []);

  const loadTransactions = useCallback(() => {
    return listarTransacoes()
      .then((response) => {
        const content = response.data?.content;

        setTransactions(Array.isArray(content) ? content : []);
      })
      .catch((error) =>
        handleApiError(error, "Não foi possível carregar as transações."),
      );
  }, []);

  const refresh = useCallback(() => {
    void loadMetrics();
    void loadTransactions();
  }, [loadMetrics, loadTransactions]);

  useEffect(() => {
    void loadMetrics();
    void loadTransactions();
  }, [loadMetrics, loadTransactions]);

  return { metrics, transactions, refresh };
}