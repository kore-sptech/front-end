import { useContext } from "react";

import { SidebarContext } from "./sidebarContext";

/**
 * Hook: acesso ao estado da sidebar.
 *
 * @returns {{collapsed: boolean, setCollapsed: (value: boolean) => void, toggle: () => void}}
 */
export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar precisa estar dentro de <SidebarProvider>.");
  }

  return context;
}