import { toast } from "sonner";

/**
 * Extrai a mensagem de erro de uma resposta (axios ou fetch), sem exibir nada.
 * Serve também para quem usa outro sistema de toast (ex.: react-hot-toast).
 *
 * @param {Error} error    erro capturado
 * @param {string} fallback mensagem padrão caso não consiga extrair detalhe
 * @returns {string} mensagem de erro
 */
export function extractErrorMessage(
  error,
  fallback = "Erro inesperado. Tente novamente.",
) {
  let message = fallback;

  // axios: error.response.data.message (ErrorResponse do backend)
  if (error?.response?.data) {
    const data = error.response.data;
    if (typeof data === "string") {
      message = data; // backend antigo devolvia string pura
    } else if (data?.message) {
      message = data.message; // backend novo (ErrorResponse)
    }
  }
  // axios sem resposta (rede/cors/máquina fora)
  else if (error?.request || error?.code === "ERR_NETWORK") {
    message =
      "Não foi possível conectar ao servidor. Verifique se o backend está rodando.";
  }

  return message;
}

/**
 * Extrai a mensagem de erro e exibe via toast.error (sonner)
 * com fallback genérico.
 *
 * @param {Error} error    erro capturado
 * @param {string} fallback mensagem padrão caso não consiga extrair detalhe
 * @returns {string} mensagem de erro exibida
 */
export function handleApiError(
  error,
  fallback = "Erro inesperado. Tente novamente.",
) {
  const message = extractErrorMessage(error, fallback);
  toast.error(message);
  return message;
}