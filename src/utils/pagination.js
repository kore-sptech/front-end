/**
 * Monta a lista de páginas visíveis, colapsando o meio com reticências quando
 * houver mais de `maxVisible` páginas.
 *
 * @param {number} total Total de páginas.
 * @param {number} current Página atual (base 1).
 * @param {number} [maxVisible] Quantidade máxima de páginas numeradas.
 * @returns {Array<number|"...">}
 */
export function buildVisiblePages(total, current, maxVisible = 5) {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let page = start; page <= end; page += 1) pages.push(page);

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}