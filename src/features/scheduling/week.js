import { addDays, startOfWeek } from "date-fns";

import { CLIENT_COLORS } from "../../constants/scheduling";

const WEEK_LABELS = ["SEG", "TER", "QUA", "QUI", "SEX", "SAB", "DOM"];

/**
 * Monta os sete dias da semana começando na segunda-feira, na mesma ordem das
 * colunas da grade (`DAY_COLUMN_INDEX`).
 *
 * @param {Date} referenceDate Qualquer dia da semana desejada.
 * @returns {Array<{label: string, day: number, date: Date}>}
 */
export function buildWeekDays(referenceDate) {
  const monday = startOfWeek(referenceDate, { weekStartsOn: 1 });

  return WEEK_LABELS.map((label, index) => {
    const date = addDays(monday, index);
    return { label, day: date.getDate(), date };
  });
}

/**
 * Intervalo [início, fim] que cobre a semana visível, em ISO.
 *
 * @param {Date} referenceDate
 * @returns {{inicio: string, fim: string}}
 */
export function buildWeekRange(referenceDate) {
  const weekDays = buildWeekDays(referenceDate);
  const first = new Date(weekDays[0].date);
  const last = new Date(weekDays[weekDays.length - 1].date);

  first.setHours(0, 0, 0, 0);
  last.setHours(23, 59, 59, 999);

  return { inicio: first.toISOString(), fim: last.toISOString() };
}

/**
 * Distribui uma cor estável por cliente, para diferenciar visualmente as
 * sessões na grade semanal.
 *
 * @param {Array<{cliente: string}>} sessions
 * @returns {Record<string, string>} Mapa cliente → nome da cor.
 */
export function buildColorMapByClient(sessions) {
  return [...new Set(sessions.map((session) => session.cliente))]
    .sort()
    .reduce((map, client, index) => {
      map[client] = CLIENT_COLORS[index % CLIENT_COLORS.length];
      return map;
    }, {});
}