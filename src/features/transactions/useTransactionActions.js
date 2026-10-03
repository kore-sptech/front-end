import { useCallback, useState } from "react";

import {
  atualizarTransacao,
  criarTransacao,
  excluirTransacao,
} from "../../services/transacoes";
import { handleApiError } from "../../utils/errorHandler";

/**
 * Hook: exclusão de transações com estado de carregamento.
 *
 * @param {() => void} onRefresh Recarrega a listagem após o sucesso.
 * @returns {{isDeleting: boolean, remove: (transactionId: string|number) => Promise<boolean>}}
 */
export function useTransactionRemoval(onRefresh) {
  const [isDeleting, setIsDeleting] = useState(false);

  const remove = useCallback(
    async (transactionId) => {
      setIsDeleting(true);

      try {
        await excluirTransacao(transactionId);
        onRefresh?.();

        return true;
      } catch (error) {
        handleApiError(error, "Não foi possível excluir a transação.");

        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    [onRefresh],
  );

  return { isDeleting, remove };
}

/**
 * Hook: envio do formulário de transação (criar ou editar).
 *
 * @param {object} params
 * @param {object|null} params.transaction Transação em edição.
 * @param {() => void} params.onSaved
 * @returns {{isSaving: boolean, save: (values: object) => Promise<boolean>}}
 */
export function useTransactionSubmission({ transaction = null, onSaved } = {}) {
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = Boolean(transaction?.id);

  const save = useCallback(
    async (values) => {
      setIsSaving(true);

      try {
        if (isEditing) {
          await atualizarTransacao(transaction.id, values);
        } else {
          await criarTransacao(values);
        }

        onSaved?.();

        return true;
      } catch (error) {
        handleApiError(
          error,
          isEditing
            ? "Não foi possível atualizar a transação."
            : "Não foi possível adicionar a transação.",
        );

        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [isEditing, onSaved, transaction],
  );

  return { isSaving, save };
}