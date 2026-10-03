import { cadastrarUsuario } from "../../services/autenticacao";
import { handleApiError } from "../../utils/errorHandler";

/**
 * Cadastra um novo usuário.
 *
 * @param {object} data Corpo enviado para `/usuarios`.
 * @returns {Promise<object>} Usuário criado.
 */
export async function signUp(data) {
  try {
    const { data: created } = await cadastrarUsuario(data);

    return created;
  } catch (error) {
    handleApiError(error, "Não foi possível concluir o cadastro.");

    throw error;
  }
}