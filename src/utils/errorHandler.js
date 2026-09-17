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
  console.log("🔍 [extractErrorMessage] Iniciando extração de erro");
  console.log("🔍 error.response?.status:", error.response?.status);
  console.log("🔍 typeof error.response?.data:", typeof error.response?.data);
  console.log("🔍 error.response?.data:", error.response?.data);

  let message = fallback;

  // axios: error.response.data.message (ErrorResponse do backend)
  if (error?.response?.data) {
    const data = error.response.data;
    console.log("✅ Entrou no branch error?.response?.data");
    console.log("🔍 typeof data:", typeof data);

    if (typeof data === "string") {
      message = data; // backend antigo devolvia string pura
      console.log("✅ Branch: string pura ->", message);
    } else if (data?.message) {
      message = data.message; // backend novo (ErrorResponse)
      console.log("✅ Branch: data.message ->", message);
    } else {
      console.log("❌ Nenhum branch match! Usando fallback:", fallback);
    }
  }
  // axios sem resposta (rede/cors/máquina fora)
  else if (error?.request || error?.code === "ERR_NETWORK") {
    message =
      "Não foi possível conectar ao servidor. Verifique se o backend está rodando.";
    console.log("✅ Branch: erro de rede");
  } else {
    console.log("❌ Nenhum branch match! Usando fallback:", fallback);
  }

  console.log("🎯 Mensagem final extraída:", message);
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