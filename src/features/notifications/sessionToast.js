import { formatCurrency } from "../../utils/formatters";

/**
 * Formata um ISO datetime como "15:10".
 *
 * @param {string} isoString
 * @returns {string}
 */
export function formatClockTime(isoString) {
  if (!isoString) return "";

  return new Date(isoString).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Deriva o tipo exibido no toast. Sessões com referências visuais são
 * tatuagens; caso contrário usa o tipo da notificação ou o rótulo padrão.
 *
 * @param {object} notification Evento bruto do SSE.
 * @param {object} session Agendamento do evento.
 * @returns {string}
 */
export function resolveSessionType(notification, session) {
  if (session?.referencias?.length > 0) return "Tatuagem";
  if (notification?.tipo && notification.tipo !== "NORMAL") return notification.tipo;

  return "Sessão";
}

/**
 * Monta a linha de metadados do toast (valor, pagamento e telefone).
 *
 * @param {object} session
 * @returns {string|undefined}
 */
function buildDescription(session) {
  if (!session) return undefined;

  const parts = [];

  if (session.preco != null) {
    parts.push(`Valor: ${formatCurrency(session.preco)}`);
  }

  if (session.formaPagamento) {
    parts.push(`Pagamento: ${session.formaPagamento}`);
  }

  if (session.telefone) {
    parts.push(`Tel: ${session.telefone}`);
  }

  return parts.length > 0 ? parts.join(" · ") : undefined;
}

/**
 * Traduz um agendamento no contrato de props do organismo `SessionToast`.
 *
 * @param {object} session
 * @param {object} [notification] Evento SSE que originou o agendamento.
 * @returns {{clientName: string, sessionType: string, scheduledTime: string, description?: string}}
 */
export function buildSessionToastPayload(session, notification = {}) {
  return {
    clientName: session?.cliente ?? "Agendamento",
    sessionType: resolveSessionType(notification, session),
    scheduledTime: formatClockTime(session?.inicio),
    description: buildDescription(session),
  };
}