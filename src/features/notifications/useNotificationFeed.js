import { useMemo, useState } from "react";
import { usePagination } from "../../hooks/usePagination";

import {
  NOTIFICATION_FILTERS,
  filterNotifications,
  normalizeNotification,
  summarizeNotifications,
} from "./notifications";

export const ITEMS_PER_PAGE = 5;

/**
 * Hook: lista de notificações paginada, com filtro por aba e resumo por
 * severidade. Utiliza diretamente os dados reais vindos do backend via provider.
 *
 * @param {object[]} liveNotifications Eventos e histórico vindos do backend.
 * @returns {object} Itens da página, paginação, resumo e setters.
 */
export function useNotificationFeed(liveNotifications = []) {
  const [filter, setFilter] = useState(NOTIFICATION_FILTERS[0].value);

  const notifications = useMemo(
    () =>
      liveNotifications.map((item, index) =>
        normalizeNotification(item, index),
      ),
    [liveNotifications],
  );

  const filtered = useMemo(
    () => filterNotifications(notifications, filter),
    [filter, notifications],
  );

  const summary = useMemo(() => summarizeNotifications(filtered), [filtered]);

  const {
    page: currentPage,
    totalPages,
    pageItems: visibleItems,
    total,
    firstIndex: firstItem,
    lastIndex: lastItem,
    goTo: setPage,
  } = usePagination(filtered, ITEMS_PER_PAGE);

  const changeFilter = (value) => {
    setFilter(value);
    setPage(1);
  };

  return {
    notifications: filtered,
    visibleItems,
    summary,
    filter,
    total,
    firstItem,
    lastItem,
    totalPages,
    currentPage,
    setFilter: changeFilter,
    setPage,
  };
}
