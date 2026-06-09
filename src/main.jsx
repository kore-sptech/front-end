import "./index.css";

import { ModalAgendamentoContextProvider } from "./context/ModalAgendamentoContext";
import { RouterProvider } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import { StrictMode } from "react";
import { Toaster } from "sonner";
import { createRoot } from "react-dom/client";
import { router } from "./router";

createRoot(document.getElementById("root")).render(
  <SidebarProvider>
    <ModalAgendamentoContextProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ModalAgendamentoContextProvider>
  </SidebarProvider>,
);
