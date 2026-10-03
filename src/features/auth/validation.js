export const AUTH_LIMITS = {
  NAME_MIN: 3,
  EMAIL_MIN: 5,
  PASSWORD_MIN: 6,
};

/**
 * Valida o formulário de login.
 *
 * @param {{email: string, password: string}} values
 * @returns {object} Mapa campo → mensagem de erro.
 */
export function validateLogin({ email, password }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "O campo de email é obrigatório.";
  }

  if (!password) {
    errors.password = "O campo de senha é obrigatório.";
  }

  return errors;
}

/**
 * Valida o formulário de cadastro.
 *
 * @param {{name: string, email: string, password: string, confirmPassword: string}} values
 * @returns {object} Mapa campo → mensagem de erro.
 */
export function validateSignUp({ name, email, password, confirmPassword }) {
  const errors = {};

  if (!name.trim()) {
    errors.name = "O campo de nome é obrigatório.";
  } else if (name.trim().length < AUTH_LIMITS.NAME_MIN) {
    errors.name = `Informe ao menos ${AUTH_LIMITS.NAME_MIN} caracteres.`;
  }

  if (!email.trim()) {
    errors.email = "O campo de email é obrigatório.";
  } else if (!email.includes("@") || !email.includes(".")) {
    errors.email = "Por favor, insira um email válido.";
  }

  if (!password) {
    errors.password = "O campo de senha é obrigatório.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirme a senha.";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "As senhas não coincidem. Tente novamente.";
  }

  return errors;
}