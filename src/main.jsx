import "./index.css";

import { ModalAgendamentoContextProvider } from "./context/ModalAgendamentoContext";
import { SidebarProvider } from "./context/SidebarContext";
import { RouterProvider } from "react-router-dom";
import { StrictMode } from "react";
import { Toaster } from "sonner";
import { createRoot } from "react-dom/client";
import { router } from "./router";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SidebarProvider>
      <ModalAgendamentoContextProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ModalAgendamentoContextProvider>
    </SidebarProvider>
  </StrictMode>
);
