import "./index.css";

import { ModalAgendamentoContextProvider } from "./context/ModalAgendamentoContext";
import { NotificationProvider } from "./providers/NotificationProvider";
import { RouterProvider } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import { Toaster } from "sonner";
import { createRoot } from "react-dom/client";
import { router } from "./router";

createRoot(document.getElementById("root")).render(
  <NotificationProvider>
    <SidebarProvider>
      <ModalAgendamentoContextProvider>
        <Toaster
          position="top-right"
          expand={true}
          richColors
          closeButton
          duration={4000}
        />
        <RouterProvider router={router} />
      </ModalAgendamentoContextProvider>
    </SidebarProvider>
  </NotificationProvider>,
);
