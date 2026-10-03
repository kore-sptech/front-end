export const SESSION_DURATIONS_MIN = Array.from({ length: 16 }, (_, i) => (i + 1) * 30);

export const DEFAULT_DURATION_MIN = 60;

const pad = (value) => String(value).padStart(2, "0");

/**
 * Formata um `Date` no formato aceito por `<input type="datetime-local">`.
 *
 * @param {Date} date
 * @returns {string} Ex.: "2026-08-10T09:00".
 */
export function toLocalDateTimeInput(date) {
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/**
 * Lê um texto de data/hora vindo da API para o formato do input local.
 *
 * @param {string} [value] Ex.: "2026-08-10T09:00:00" ou "2026-08-10 09:00:00".
 * @returns {string}
 */
export function fromApiDateTime(value) {
  return value ? value.replace(" ", "T").slice(0, 16) : "";
}

/**
 * Desloca um texto de data/hora local em minutos.
 *
 * @param {string} value Texto no formato de `datetime-local`.
 * @param {number} minutes
 * @returns {string} Texto deslocado (ou "" quando inválido).
 */
export function addMinutesToLocalInput(value, minutes) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return toLocalDateTimeInput(new Date(date.getTime() + minutes * 60_000));
}

/**
 * Rótulo legível das durações oferecidas ("1h", "1h 30min").
 *
 * @param {number} minutes
 * @returns {string}
 */
export function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return `${hours > 0 ? `${hours}h` : ""}${rest > 0 ? ` ${rest}min` : ""}`.trim();
}