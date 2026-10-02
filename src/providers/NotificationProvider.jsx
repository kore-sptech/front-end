import { useCallback, useEffect, useRef, useState } from "react";

import { ContextoNotificacoes } from "../context/ContextoNotificacoes";
import { SessionToast } from "../components/SessionToast";
import {
  cancelarAgendamento,
  confirmarAgendamento,
} from "../servicos/agendamentos";
import { abrirStreamDeNotificacoes } from "../servicos/notificacoes";
import { handleApiError } from "../utils/errorHandler";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Formata "2026-06-08T15:10:00" → "15:10" */
function formatTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Deriva o tipo de sessão a partir dos dados disponíveis.
 * Prioriza o campo `tipo` da notificação; como fallback usa "Sessão".
 * Adapte esta função conforme seu domínio crescer.
 */
function resolveSessionType(notificacao, agendamento) {
  if (agendamento?.referencias?.length > 0) return "Tatuagem";
  if (notificacao?.tipo && notificacao.tipo !== "NORMAL")
    return notificacao.tipo;
  return "Sessão";
}

/**
 * Monta a descrição exibida no toast a partir do payload.
 * Inclui forma de pagamento e valor quando disponíveis.
 */
function buildDescription(agendamento) {
  if (!agendamento) return undefined;

  const parts = [];

  if (agendamento.preco != null) {
    const valor = Number(agendamento.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    parts.push(`Valor: ${valor}`);
  }

  if (agendamento.formaPagamento) {
    parts.push(`Pagamento: ${agendamento.formaPagamento}`);
  }

  if (agendamento.telefone) {
    parts.push(`Tel: ${agendamento.telefone}`);
  }

  return parts.length > 0 ? parts.join(" · ") : undefined;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const retryTimeout = useRef(null);
  const eventSourceRef = useRef(null);

  // ── Toast helpers ────────────────────────────────────────────────────────

  const showSessionToast = useCallback((options) => {
    const id = crypto.randomUUID();

    toast.custom(
      (toastId) => (
        <SessionToast
          id={toastId}
          clientName={options.clientName}
          sessionType={options.sessionType}
          scheduledTime={options.scheduledTime}
          description={options.description}
          onConfirm={options.onConfirm}
          onCancel={options.onCancel}
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

    return id;
  }, []);

  const dismissToast = useCallback((id) => toast.dismiss(id), []);
  const dismissAll = useCallback(() => toast.dismiss(), []);

  // ── SSE ──────────────────────────────────────────────────────────────────

  function connect() {
    const eventSource = abrirStreamDeNotificacoes();
    console.log("Conectando ao SSE...");
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      if (event.data === "heartbeat") return;

      let parsed;
      try {
        parsed = JSON.parse(event.data);
      } catch (err) {
        console.error("[SSE] Payload inválido:", event.data, err);
        return;
      }

      console.log("[SSE] Evento recebido:", parsed);

      // Atualiza o estado de notificações (lista/sino)
      setNotifications((prev) => [...prev, parsed]);

      // Dispara o toast apenas para notificações de agendamento próximo
      const { notificacao, agendamento } = parsed;

      if (agendamento?.id) {
        showSessionToast({
          clientName: agendamento.cliente,
          sessionType: resolveSessionType(notificacao, agendamento),
          scheduledTime: formatTime(agendamento.inicio),
          description: buildDescription(agendamento),

          // ── Callbacks de ação ──────────────────────────────────────────
          // Substitua pelo seu serviço de API real
          onConfirm: () =>
            confirmarAgendamento(agendamento.id)
              .then(() => {
                toast.success("Agendamento confirmado com sucesso!");
                window.location.reload();
              })
              .catch((err) => {
                handleApiError(
                  err,
                  "Não foi possível confirmar a sessão.",
                );
              }),
          onCancel: () =>
            cancelarAgendamento(agendamento.id)
              .then(() => {
                toast.success("Agendamento cancelado com sucesso!");
                window.location.reload();
              })
              .catch((err) => {
                handleApiError(
                  err,
                  "Não foi possível cancelar o agendamento.",
                );
              }),
        });
      }
    };

    eventSource.onerror = (err) => {
      console.error("[SSE] Erro na conexão:", err);
      eventSource.close();
      retryTimeout.current = setTimeout(() => {
        console.info("[SSE] Tentando reconectar...");
        connect();
      }, 5000);
    };
  }

  useEffect(() => {
    connect();
    return () => {
      eventSourceRef.current?.close();
      clearTimeout(retryTimeout.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <ContextoNotificacoes.Provider
      value={{ notifications, showSessionToast, dismissToast, dismissAll }}
    >
      {children}
    </ContextoNotificacoes.Provider>
  );
}
