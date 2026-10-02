import { createContext, useContext } from "react";

export const SidebarContext = createContext(null);

export function useSidebar() {
  return useContext(SidebarContext);
}
