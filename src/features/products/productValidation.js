export const PRODUCT_LIMITS = {
  NAME_MIN: 3,
  NAME_MAX: 45,
  DESCRIPTION_MAX: 80,
  CATEGORY_NAME_MIN: 3,
  CATEGORY_NAME_MAX: 45,
  CATEGORY_DESCRIPTION_MAX: 150,
};

/**
 * Valida o formulário de produto.
 *
 * @param {{name: string, description: string, minAlertQuantity: string|number, categoryId: string|number|null}} values
 * @returns {object} Mapa campo → mensagem de erro.
 */
export function validateProduct(values) {
  const errors = {};
  const name = values.name.trim();
  const description = values.description ?? "";

  if (name.length < PRODUCT_LIMITS.NAME_MIN) {
    errors.name = `O nome deve ter no mínimo ${PRODUCT_LIMITS.NAME_MIN} caracteres.`;
  } else if (name.length > PRODUCT_LIMITS.NAME_MAX) {
    errors.name = `O nome deve ter no máximo ${PRODUCT_LIMITS.NAME_MAX} caracteres.`;
  }

  if (description.length > PRODUCT_LIMITS.DESCRIPTION_MAX) {
    errors.description = `A descrição não pode ultrapassar ${PRODUCT_LIMITS.DESCRIPTION_MAX} caracteres.`;
  }

  const minAlertQuantity = parseInt(values.minAlertQuantity, 10);

  if (values.minAlertQuantity === "" || Number.isNaN(minAlertQuantity)) {
    errors.minAlertQuantity = "Informe a quantidade mínima de alerta.";
  } else if (minAlertQuantity < 0) {
    errors.minAlertQuantity = "A quantidade mínima deve ser um número positivo.";
  }

  if (!values.categoryId) {
    errors.categoryId = "O produto deve possuir uma categoria.";
  }

  return errors;
}

/**
 * Valida o formulário de criação de categoria.
 *
 * @param {{name: string, description: string}} values
 * @returns {object} Mapa campo → mensagem de erro.
 */
export function validateCategory(values) {
  const errors = {};
  const name = values.name.trim();

  if (name.length < PRODUCT_LIMITS.CATEGORY_NAME_MIN) {
    errors.name = `O nome deve ter no mínimo ${PRODUCT_LIMITS.CATEGORY_NAME_MIN} caracteres.`;
  } else if (name.length > PRODUCT_LIMITS.CATEGORY_NAME_MAX) {
    errors.name = `O nome deve ter no máximo ${PRODUCT_LIMITS.CATEGORY_NAME_MAX} caracteres.`;
  }

  if (values.description.length > PRODUCT_LIMITS.CATEGORY_DESCRIPTION_MAX) {
    errors.description = `A descrição não pode ultrapassar ${PRODUCT_LIMITS.CATEGORY_DESCRIPTION_MAX} caracteres.`;
  }

  return errors;
}

/**
 * Monta o payload de produto esperado pelo backend.
 *
 * @param {object} values
 * @param {string} usuarioId
 * @returns {object} Corpo da requisição.
 */
export function buildProductPayload(values, usuarioId) {
  return {
    nome: values.name.trim(),
    descricao: values.description,
    possuiValidade: Boolean(values.hasExpiry),
    qtdMinAlerta: parseInt(values.minAlertQuantity, 10),
    tipo: values.type ?? "",
    usuario: usuarioId,
    categoriaId: values.categoryId,
  };
}