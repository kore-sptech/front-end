export const NOTIFICATION_SEVERITIES = ["CRITICO", "ATENCAO", "INFORMATIVO"];

export const NOTIFICATION_FILTERS = [
  { value: "TODAS", label: "TODAS" },
  { value: "ESTOQUE", label: "ESTOQUE" },
  { value: "SESSÕES", label: "SESSÕES" },
  { value: "VALIDADE", label: "VALIDADE" },
];

const SEVERITY_BY_FILTER = {
  ESTOQUE: "CRITICO",
  "SESSÕES": "INFORMATIVO",
  VALIDADE: "ATENCAO",
};

/**
 * Normaliza o payload recebido do SSE em um alerta exibível.
 *
 * @param {object} notification Evento bruto do servidor.
 * @param {number} index Índice do evento (fallback de id).
 * @returns {{id: string|number, tipo: string, titulo: string, descricao: string, tempo: string}}
 */
export function normalizeNotification(notification, index = 0) {
  const data = notification.agendamento || notification;
  const tipo = data.tipo || "INFORMATIVO";

  return {
    id: data.id || notification.id || `evento-${index}`,
    tipo: NOTIFICATION_SEVERITIES.includes(tipo) ? tipo : "INFORMATIVO",
    titulo: data.cliente
      ? `Sessão: ${data.cliente}`
      : notification.titulo || "Nova notificação",
    descricao:
      data.descricao ||
      (data.inicio
        ? `Sessão agendada para ${new Date(data.inicio).toLocaleString("pt-BR")}.`
        : "Você recebeu uma nova notificação."),
    tempo: data.inicio ? new Date(data.inicio).toLocaleString("pt-BR") : "Agora",
  };
}

/**
 * Aplica o filtro de aba ativo.
 *
 * @param {object[]} notifications
 * @param {string} filter Valor de `NOTIFICATION_FILTERS`.
 * @returns {object[]}
 */
export function filterNotifications(notifications, filter) {
  const severity = SEVERITY_BY_FILTER[filter];

  if (!severity) return notifications;

  return notifications.filter((item) => item.tipo === severity);
}

/**
 * Conta os alertas por severidade.
 *
 * @param {object[]} notifications
 * @returns {{CRITICO: number, ATENCAO: number, INFORMATIVO: number}}
 */
export function summarizeNotifications(notifications) {
  return notifications.reduce(
    (summary, item) => ({ ...summary, [item.tipo]: summary[item.tipo] + 1 }),
    { CRITICO: 0, ATENCAO: 0, INFORMATIVO: 0 },
  );
}