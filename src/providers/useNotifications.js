import { useContext } from "react";

import { NotificationsContext } from "./notificationsContext";

/**
 * Hook: acesso ao contexto de notificações.
 *
 * @returns {{notifications: object[], isLoading: boolean, showSessionToast: (session: object, notification?: object) => void, dismissNotification: (id: string|number) => void, dismissToast: (id: string) => void, dismissAll: () => void}}
 */
export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotifications precisa estar dentro de <NotificationProvider>.");
  }

  return context;
}