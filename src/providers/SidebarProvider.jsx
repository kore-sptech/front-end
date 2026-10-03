import { useCallback, useMemo, useState } from "react";

import { SidebarContext } from "./sidebarContext";

/**
 * Organismo de estado: Sidebar recolhível compartilhada por todo o shell.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 */
export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(() => setCollapsed((prev) => !prev), []);

  const value = useMemo(
    () => ({ collapsed, setCollapsed, toggle }),
    [collapsed, toggle],
  );

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}