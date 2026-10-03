import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { DEFAULT_FILTERS, EMPTY_METRICS } from "./transactionForm";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { handleApiError } from "../../utils/errorHandler";
import {
  listarMetricas,
  listarTransacoes,
} from "../../services/transacoes";

/**
 * Hook: lista paginada de transações + métricas financeiras.
 * A página vive na query string (`?page=`), enabling links compartilháveis.
 *
 * @returns {object} Estado, filtros e ações.
 */
export function useTransactions() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(DEFAULT_FILTERS.nome);
  const [type, setType] = useState(DEFAULT_FILTERS.tipo);
  const [createdAt, setCreatedAt] = useState(DEFAULT_FILTERS.dataCriacao);
  const [sort, setSort] = useState(DEFAULT_FILTERS.sort);
  const [page, setPage] = useState(() =>
    parseInt(searchParams.get("page") ?? "0", 10) || 0,
  );
  const [transactions, setTransactions] = useState({ content: [] });
  const [metrics, setMetrics] = useState(EMPTY_METRICS);

  const debouncedSearch = useDebouncedValue(search, 250);

  // A busca só faz parte dos filtros depois que o usuário para de digitar.
  const filters = useMemo(
    () => ({ ...DEFAULT_FILTERS, nome: debouncedSearch, tipo: type, dataCriacao: createdAt, sort }),
    [createdAt, debouncedSearch, sort, type],
  );

  const loadMetrics = useCallback(() => {
    listarMetricas()
      .then(({ data }) => setMetrics({ ...EMPTY_METRICS, ...data }))
      .catch((error) =>
        handleApiError(error, "Não foi possível carregar as métricas."),
      );
  }, []);

  const loadTransactions = useCallback(() => {
    listarTransacoes({
      page,
      tipo: filters.tipo,
      dataCriacao: filters.dataCriacao,
      sort: filters.sort,
      busca: filters.nome,
    })
      .then(({ data }) => setTransactions(data))
      .catch((error) =>
        handleApiError(error, "Não foi possível carregar as transações."),
      );
  }, [filters, page]);

  const refresh = useCallback(() => {
    loadTransactions();
    loadMetrics();
  }, [loadMetrics, loadTransactions]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const goToPage = useCallback(
    (nextPage) => {
      setPage(nextPage);
      setSearchParams({ page: String(nextPage) }, { replace: true });
    },
    [setSearchParams],
  );

  const setFilter = useCallback(
    (name, value) => {
      if (name === "tipo") setType(value);
      else if (name === "dataCriacao") setCreatedAt(value);
      else if (name === "sort") setSort(value);

      goToPage(0);
    },
    [goToPage],
  );

  const clearFilters = useCallback(() => {
    setType(DEFAULT_FILTERS.tipo);
    setCreatedAt(DEFAULT_FILTERS.dataCriacao);
    setSort(DEFAULT_FILTERS.sort);
    setSearch(DEFAULT_FILTERS.nome);
    goToPage(0);
  }, [goToPage]);

  const hasActiveFilters = useMemo(
    () =>
      debouncedSearch !== DEFAULT_FILTERS.nome ||
      createdAt !== DEFAULT_FILTERS.dataCriacao ||
      type !== DEFAULT_FILTERS.tipo ||
      sort !== DEFAULT_FILTERS.sort,
    [createdAt, debouncedSearch, sort, type],
  );

  return {
    transactions,
    metrics,
    filters,
    search,
    setSearch,
    setFilter,
    clearFilters,
    hasActiveFilters,
    goToPage,
    refresh,
  };
}