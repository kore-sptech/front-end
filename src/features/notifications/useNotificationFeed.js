import { useMemo, useState } from "react";

import {
  NOTIFICATION_FILTERS,
  filterNotifications,
  normalizeNotification,
  summarizeNotifications,
} from "./notifications";
import { SEED_NOTIFICATIONS } from "./seed";

export const ITEMS_PER_PAGE = 5;

/**
 * Hook: lista de notificações paginada, com filtro por aba e resumo por
 * severidade. Usa os eventos do provider e, enquanto não houver nenhum,
 * os dados de exemplo do protótipo.
 *
 * @param {object[]} liveNotifications Eventos brutos recebidos via SSE.
 * @returns {object} Itens da página, paginação, resumo e setters.
 */
export function useNotificationFeed(liveNotifications = []) {
  const [filter, setFilter] = useState(NOTIFICATION_FILTERS[0].value);
  const [page, setPage] = useState(1);

  const notifications = useMemo(
    () =>
      liveNotifications.length > 0
        ? liveNotifications.map(normalizeNotification)
        : SEED_NOTIFICATIONS,
    [liveNotifications],
  );

  const filtered = useMemo(
    () => filterNotifications(notifications, filter),
    [filter, notifications],
  );

  const summary = useMemo(
    () => summarizeNotifications(filtered),
    [filtered],
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentPage = Math.min(page, Math.max(totalPages, 1));

  const visibleItems = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const firstItem = filtered.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const lastItem = Math.min(currentPage * ITEMS_PER_PAGE, filtered.length);

  const changeFilter = (value) => {
    setFilter(value);
    setPage(1);
  };

  return {
    notifications: filtered,
    visibleItems,
    summary,
    filter,
    total: filtered.length,
    firstItem,
    lastItem,
    totalPages,
    currentPage,
    setFilter: changeFilter,
    setPage,
  };
}