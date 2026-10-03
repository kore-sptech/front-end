import { toast } from "sonner";

const MENSAGEM_REDE =
  "Não foi possível conectar ao servidor. Verifique se o backend está rodando.";

/**
 * Extrai a mensagem de erro de uma resposta (axios), sem exibir nada.
 * Útil para quem usa outro sistema de toast.
 *
 * @param {Error} error Erro capturado.
 * @param {string} fallback Mensagem padrão quando não há detalhe na resposta.
 * @returns {string} Mensagem de erro.
 */
export function extractErrorMessage(
  error,
  fallback = "Erro inesperado. Tente novamente.",
) {
  const data = error?.response?.data;

  if (typeof data === "string" && data) return data;
  if (data?.message) return data.message;

  if (!error?.response) return MENSAGEM_REDE;

  return fallback;
}

/**
 * Extrai a mensagem de erro e a exibe em um toast.
 *
 * @param {Error} error Erro capturado.
 * @param {string} fallback Mensagem padrão quando não há detalhe na resposta.
 * @returns {string} Mensagem exibida.
 */
export function handleApiError(
  error,
  fallback = "Erro inesperado. Tente novamente.",
) {
  const message = extractErrorMessage(error, fallback);

  toast.error(message);

  return message;
}