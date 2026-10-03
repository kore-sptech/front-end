/**
 * Utilitários de entrada monetária (máscara "R$ 1.234,56").
 * A exibição de valores já formatados vive em `utils/formatters.js`.
 */

/**
 * Converte um valor em centavos para o texto no padrão brasileiro.
 *
 * @param {number} cents Valor em centavos.
 * @returns {string} Texto como "1.234,56".
 */
export function maskCurrencyInput(cents) {
  const safeCents = Number.isFinite(cents) ? Math.max(0, Math.round(cents)) : 0;

  return (safeCents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Extrai os centavos de um texto monetário já mascarado.
 *
 * @param {string} masked Texto no padrão brasileiro ("1.234,56").
 * @returns {number} Valor em centavos.
 */
export function centsFromInput(masked) {
  const digits = String(masked ?? "").replace(/\D/g, "");

  return digits ? parseInt(digits, 10) : 0;
}