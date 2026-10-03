import { useState } from "react";

/**
 * Hook: paginação de uma lista já carregada em memória.
 * Não dispara requisições: o corte é feito no array.
 *
 * @template T
 * @param {T[]} items Lista completa.
 * @param {number} [pageSize] Itens por página.
 * @returns {{page: number, totalPages: number, pageItems: T[], total: number, firstIndex: number, lastIndex: number, goTo: (page: number) => void}}
 */
export function usePagination(items, pageSize = 5) {
  const [requestedPage, setRequestedPage] = useState(1);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(requestedPage, totalPages);

  const offset = (page - 1) * pageSize;
  const pageItems = items.slice(offset, offset + pageSize);

  return {
    page,
    totalPages,
    pageItems,
    total,
    firstIndex: total === 0 ? 0 : offset + 1,
    lastIndex: Math.min(offset + pageSize, total),
    goTo: (next) => {
      if (next >= 1 && next <= totalPages) setRequestedPage(next);
    },
  };
}