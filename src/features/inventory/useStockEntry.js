import { useCallback, useMemo, useState } from "react";

import { adicionarEstoque } from "../../services/estoque";
import { handleApiError } from "../../utils/errorHandler";

const EMPTY_FORM = {
  quantity: "",
  expiryDate: "",
  unitPrice: "",
};

const toLocalDateTime = (date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 19);

/**
 * Valida a entrada de estoque.
 *
 * @param {{quantity: string, unitPrice: string}} values
 * @returns {object} Mapa campo → mensagem de erro.
 */
export function validateStockEntry({ quantity, unitPrice }) {
  const errors = {};

  const parsedQuantity = Number(quantity);

  if (!Number.isInteger(parsedQuantity) || parsedQuantity <= 0) {
    errors.quantity = "Informe uma quantidade válida (número inteiro maior que zero).";
  }

  const parsedPrice = Number(unitPrice);

  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    errors.unitPrice = "Informe um valor unitário válido.";
  }

  return errors;
}

/**
 * Monta o corpo esperado por `POST /estoque/{quantidade}/{produtoId}`.
 *
 * @param {{expiryDate: string, unitPrice: string}} values
 * @returns {object}
 */
export function buildStockEntryPayload({ expiryDate, unitPrice }) {
  return {
    valorUnitario: Number(unitPrice),
    dataValidade: expiryDate ? `${expiryDate}T00:00:00` : null,
    dataEntrada: toLocalDateTime(new Date()),
    seAtivo: true,
  };
}

/**
 * Hook: formulário de entrada de estoque.
 *
 * @param {object} options
 * @param {string} options.productId
 * @param {() => void} options.onSaved
 * @returns {object} Estado, erros e ação de envio.
 */
export function useStockEntry({ productId, onSaved }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const change = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateStockEntry({ ...values, [name]: value })[name],
    }));
  }, [values]);

  const isValid = useMemo(
    () => Object.keys(validateStockEntry(values)).length === 0,
    [values],
  );

  const submit = useCallback(async () => {
    const validationErrors = validateStockEntry(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return false;

    setIsSaving(true);

    try {
      const { status } = await adicionarEstoque(
        productId,
        values.quantity,
        buildStockEntryPayload(values),
      );

      if (status !== 201) {
        throw new Error("Adição sem confirmação do servidor.");
      }

      onSaved?.();
      return true;
    } catch (error) {
      handleApiError(error, "Não foi possível adicionar o estoque.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [onSaved, productId, values]);

  return { values, change, errors, isValid, isSaving, submit };
}