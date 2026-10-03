import { useCallback, useState } from "react";
import { toast } from "sonner";

import {
  cancelarAgendamento,
  confirmarAgendamento,
  confirmarPagamento,
} from "../../services/agendamentos";
import { handleApiError } from "../../utils/errorHandler";

const MENSAGENS = {
  confirm: "Sessão confirmada com sucesso!",
  payment: "Pagamento confirmado com sucesso!",
  cancel: "Agendamento cancelado com sucesso!",
};

const FALHAS = {
  confirm: "Não foi possível confirmar a sessão.",
  payment: "Não foi possível confirmar o pagamento.",
  cancel: "Não foi possível cancelar o agendamento.",
};

/**
 * Hook: transições de status de um agendamento (confirmar, pagar, cancelar).
 *
 * @param {object} [options]
 * @param {() => void} [options.onChanged] Disparado após qualquer transição.
 * @returns {object} Ações e o status em execução.
 */
export function useSessionStatusActions({ onChanged } = {}) {
  const [pendingAction, setPendingAction] = useState(null);

  const run = useCallback(
    async (action, request) => {
      setPendingAction(action);

      try {
        await request();

        toast.success(MENSAGENS[action]);
        onChanged?.();

        return true;
      } catch (error) {
        handleApiError(error, FALHAS[action]);
        return false;
      } finally {
        setPendingAction(null);
      }
    },
    [onChanged],
  );

  return {
    pendingAction,
    isPending: Boolean(pendingAction),
    confirm: (id) => run("confirm", () => confirmarAgendamento(id)),
    confirmPayment: (id) => run("payment", () => confirmarPagamento(id)),
    cancel: (id) => run("cancel", () => cancelarAgendamento(id)),
  };
}