import { entrar } from "../../services/autenticacao";
import { handleApiError } from "../../utils/errorHandler";
import { saveSession } from "../../utils/auth";

/**
 * Autentica o usuário e persiste a sessão.
 *
 * @param {{email: string, senha: string}} credentials
 * @returns {Promise<object>} Sessão salva (nome, token, id).
 */
export async function login(credentials) {
  try {
    const { data } = await entrar(credentials.email, credentials.senha);

    saveSession(data);

    return data;
  } catch (error) {
    handleApiError(error, "Email ou senha incorretos.");

    throw error;
  }
}
