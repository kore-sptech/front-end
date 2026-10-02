import { createContext, useContext } from "react";

export const AgendamentoContext = createContext({});

export function useAgendamentos() {
  return useContext(AgendamentoContext);
}
