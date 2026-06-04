import "./index.css";

import { ModalAgendamentoContextProvider } from "./context/ModalAgendamentoContext";
import { NotificationProvider } from "./providers/NotificationProvider";
import { RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import { Toaster } from "sonner";
import { createRoot } from "react-dom/client";
import { router } from "./router";

createRoot(document.getElementById("root")).render(
  <NotificationProvider>
    <ModalAgendamentoContextProvider>
      <RouterProvider router={router} />
      <Toaster />
      prova
    </ModalAgendamentoContextProvider>
  </NotificationProvider>,
);
