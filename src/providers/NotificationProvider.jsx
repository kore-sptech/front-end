import { useEffect, useState } from "react";

import { NotificationProviderContext } from "../context/NotificationContext";

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/sse/stream");
    eventSource.onmessage = (event) => {
      const newNotification = event.data;
      setNotifications((prev) => [...prev, newNotification]);
    };

    eventSource.onerror = (err) => {
      console.error("Erro na conexão SSE: ", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <NotificationProviderContext.Provider value={{ notifications }}>
      {children}
    </NotificationProviderContext.Provider>
  );
}
