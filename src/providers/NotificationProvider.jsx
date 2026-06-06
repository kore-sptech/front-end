import { useEffect, useRef, useState } from "react";

import { NotificationProviderContext } from "../context/NotificationContext";

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const retryTimeout = useRef(null);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    function connect() {
      const eventSource = new EventSource("http://localhost:8080/sse/stream");
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        // ignora heartbeat — não exibe como notificação real
        if (event.data === "heartbeat") return;
        const notification = JSON.parse(event.data);

        setNotifications((prev) => [...prev, notification]);
      };

      eventSource.onerror = (err) => {
        console.error("Erro na conexão SSE:", err);
        eventSource.close();

        // reconecta após 5 segundos em vez de parar para sempre
        retryTimeout.current = setTimeout(() => {
          console.info("Tentando reconectar SSE...");
          connect();
        }, 5000);
      };
    }

    connect();

    return () => {
      // cleanup: fecha conexão e cancela retry pendente ao desmontar
      eventSourceRef.current?.close();
      clearTimeout(retryTimeout.current);
    };
  }, []);

  return (
    <NotificationProviderContext.Provider value={{ notifications }}>
      {children}
    </NotificationProviderContext.Provider>
  );
}
