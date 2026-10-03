const DIGITS_ONLY = /\D/g;

/**
 * Valida os campos de um agendamento.
 *
 * @param {object} fields Campos do formulário (`cliente`, `preco`, `telefone`,
 *   `pagamento`, `de`).
 * @param {number} durationMinutes Duração em minutos.
 * @returns {object} Mapa campo → mensagem de erro.
 */
export function validateSession(fields, durationMinutes) {
  const errors = {};

  if (!fields.cliente?.trim()) {
    errors.cliente = "Nome é obrigatório";
  } else if (fields.cliente.trim().length < 3) {
    errors.cliente = "Mínimo 3 caracteres";
  }

  if (!fields.preco) {
    errors.preco = "Preço é obrigatório";
  } else if (Number.isNaN(parseFloat(fields.preco)) || parseFloat(fields.preco) <= 0) {
    errors.preco = "Informe um valor maior que zero";
  }

  if (!fields.telefone?.trim()) {
    errors.telefone = "Telefone é obrigatório";
  } else if (fields.telefone.replace(DIGITS_ONLY, "").length !== 11) {
    errors.telefone = "Telefone incompleto — use (99) 99999-9999";
  }

  if (!fields.pagamento) {
    errors.pagamento = "Selecione a forma de pagamento";
  }

  if (!fields.de) {
    errors.de = "Informe o horário de início";
  }

  if (!durationMinutes || durationMinutes <= 0) {
    errors.ate = "Informe a duração";
  } else if (fields.de) {
    const start = new Date(fields.de);
    const end = new Date(start.getTime() + durationMinutes * 60_000);

    if (end <= start) {
      errors.ate = "Horário de término deve ser após o início";
    }
  }

  return errors;
}

/**
 * @param {object} fields
 * @param {number} durationMinutes
 * @returns {boolean} `true` quando não há nenhum erro.
 */
export function isSessionValid(fields, durationMinutes) {
  return Object.keys(validateSession(fields, durationMinutes)).length === 0;
}

/**
 * Link de WhatsApp para o cliente do agendamento.
 *
 * @param {string} clientName
 * @param {string} phoneMasked Telefone já mascarado.
 * @returns {string} URL do WhatsApp.
 */
export function buildWhatsAppLink(clientName, phoneMasked) {
  const digits = (phoneMasked ?? "").replace(DIGITS_ONLY, "");
  const message = encodeURIComponent(`Ola, ${clientName}.`);

  return `https://wa.me/${digits}?text=${message}`;
}