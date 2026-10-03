import { createContext } from "react";

/**
 * Contexto de notificações: eventos do SSE + toasts de sessão.
 *
 * @type {React.Context<object|null>}
 */
export const NotificationsContext = createContext(null);