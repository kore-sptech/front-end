import { createContext, useContext } from "react";

export const ContextoNotificacoes = createContext(null);

export function useNotificacoes() {
  return useContext(ContextoNotificacoes);
}
