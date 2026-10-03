import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formata um número como moeda brasileira (ex.: "R$ 1.234,56").
 *
 * @param {number|string} value
 * @returns {string}
 */
export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

/**
 * Formata uma data ISO como "12 jun, 2025".
 *
 * @param {string|Date} value
 * @returns {string}
 */
export function formatDate(value) {
  if (!value) return "";

  const date = typeof value === "string" ? parseISO(value) : value;

  return format(date, "dd MMM, yyyy", { locale: ptBR });
}

/**
 * Formata um número como percentual com duas casas.
 *
 * @param {number} value
 * @param {boolean} [withSignal] Prefixa "+" quando positivo.
 * @returns {string}
 */
export function formatPercent(value, withSignal = false) {
  const number = Number(value) || 0;
  const sign = withSignal && number > 0 ? "+" : "";

  return `${sign}${number.toFixed(2)}%`;
}