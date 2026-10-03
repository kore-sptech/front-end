import { createContext } from "react";

/**
 * Contexto da sidebar recolhível compartilhada por todo o shell.
 *
 * @type {React.Context<object|null>}
 */
export const SidebarContext = createContext(null);