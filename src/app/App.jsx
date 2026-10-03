import { NotificationProvider } from "../providers/NotificationProvider";
import { RouterProvider } from "react-router-dom";
import { SchedulingModalProvider } from "../providers/SchedulingModalProvider";
import { SidebarProvider } from "../providers/SidebarProvider";
import { Toaster } from "sonner";
import { router } from "./router";

/**
 * Bootstrap da aplicação: providers globais + rotas.
 *
 * @returns {React.ReactElement}
 */
export default function App() {
  const reloadSession = () => window.location.reload();

  return (
    <NotificationProvider onSessionChanged={reloadSession}>
      <SidebarProvider>
        <SchedulingModalProvider>
          <Toaster duration={4000} />
          <RouterProvider router={router} />
        </SchedulingModalProvider>
      </SidebarProvider>
    </NotificationProvider>
  );
}