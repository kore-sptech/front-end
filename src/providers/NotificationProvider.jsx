import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { NotificationsContext } from "./notificationsContext";
import { buildSessionToastPayload } from "../features/notifications/sessionToast";
import {
  cancelarAgendamento,
  confirmarAgendamento,
} from "../services/agendamentos";
import { abrirStreamDeNotificacoes } from "../services/notificacoes";
import SessionToast from "../ui/organisms/SessionToast";
import { handleApiError } from "../utils/errorHandler";

const RECONNECT_DELAY_MS = 5000;

/**
 * Organismo de estado: stream SSE de notificações + toasts de sessão.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {() => void} [props.onSessionChanged] Chamado quando um agendamento
 *   é confirmado/cancelado pelo toast, para recarregar as telas abertas.
 */
export function NotificationProvider({ children, onSessionChanged }) {
  const [notifications, setNotifications] = useState([]);
  const retryTimeout = useRef(null);
  const eventSourceRef = useRef(null);
  const reloadRef = useRef(onSessionChanged);

  useEffect(() => {
    reloadRef.current = onSessionChanged;
  }, [onSessionChanged]);

  const dismissToast = useCallback((id) => toast.dismiss(id), []);
  const dismissAll = useCallback(() => toast.dismiss(), []);

  const runSessionAction = useCallback(
    ({ successMessage, errorMessage, action }) =>
      action()
        .then(() => {
          toast.success(successMessage);
          reloadRef.current?.();
        })
        .catch((error) => handleApiError(error, errorMessage)),
    [],
  );

  const showSessionToast = useCallback(
    (session, notification = {}) => {
      const id = crypto.randomUUID();

      toast.custom(
        (toastId) => (
          <SessionToast
            id={toastId}
            {...buildSessionToastPayload(session, notification)}
            onConfirm={() =>
              runSessionAction({
                successMessage: "Agendamento confirmado com sucesso!",
                errorMessage: "Não foi possível confirmar a sessão.",
                action: () => confirmarAgendamento(session.id),
              })
            }
            onCancel={() =>
              runSessionAction({
                successMessage: "Agendamento cancelado com sucesso!",
                errorMessage: "Não foi possível cancelar o agendamento.",
                action: () => cancelarAgendamento(session.id),
              })
            }
          />
        ),
        {
          id,
          duration: Infinity,
          position: "bottom-right",
          unstyled: true,
          classNames: {
            toast: "!bg-transparent !border-0 !shadow-none !p-0",
          },
        },
      );
    },
    [runSessionAction],
  );

  useEffect(() => {
    let ativo = true;

    function connect() {
      if (!ativo) return;

      const eventSource = abrirStreamDeNotificacoes();
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        if (event.data === "heartbeat") return;

        let parsed;
        try {
          parsed = JSON.parse(event.data);
        } catch {
          return;
        }

        setNotifications((prev) => [...prev, parsed]);

        const { agendamento } = parsed;

        if (agendamento?.id) showSessionToast(agendamento, parsed);
      };

      eventSource.onerror = () => {
        eventSource.close();
        retryTimeout.current = setTimeout(connect, RECONNECT_DELAY_MS);
      };
    }

    connect();

    return () => {
      ativo = false;
      eventSourceRef.current?.close();
      clearTimeout(retryTimeout.current);
    };
  }, [showSessionToast]);

  const value = useMemo(
    () => ({ notifications, showSessionToast, dismissToast, dismissAll }),
    [notifications, showSessionToast, dismissToast, dismissAll],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}
