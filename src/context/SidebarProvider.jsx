import { useState } from "react";

import { SidebarContext } from "./SidebarContext";

export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}
