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
 * Normaliza o payload recebido do SSE ou da API em um alerta exibível.
 *
 * @param {object} notification Evento bruto do servidor.
 * @param {number} index Índice do evento (fallback de id).
 * @returns {{id: string|number, tipo: string, titulo: string, descricao: string, tempo: string, acaoTipo: string, entidadeTipo: string, entidadeId: number}}
 */
export function normalizeNotification(notification, index = 0) {
  const data = notification.agendamento || notification;
  const rawSev = data.severidade || data.tipo || notification.severidade || notification.tipo || "INFORMATIVO";
  const severidade = NOTIFICATION_SEVERITIES.includes(rawSev) ? rawSev : "INFORMATIVO";

  return {
    id: data.id || notification.id || `evento-${index}`,
    tipo: severidade,
    titulo: data.titulo || notification.titulo || (data.cliente ? `Próxima Sessão: ${data.cliente}` : "Nova notificação"),
    descricao: data.mensagem || data.descricao || "Você recebeu uma nova notificação.",
    tempo: data.criadaEm ? new Date(data.criadaEm).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }) : "Há 5 min",
    acaoTipo: data.acaoTipo || notification.acaoTipo || null,
    entidadeTipo: data.entidadeTipo || notification.entidadeTipo || null,
    entidadeId: data.entidadeId || notification.entidadeId || null,
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
    (summary, item) => ({ ...summary, [item.tipo]: (summary[item.tipo] || 0) + 1 }),
    { CRITICO: 0, ATENCAO: 0, INFORMATIVO: 0 },
  );
}
