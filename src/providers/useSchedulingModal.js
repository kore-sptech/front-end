import { useContext } from "react";

import { SchedulingModalContext } from "./schedulingModalContext";

/**
 * Hook: acesso ao modal de agendamento.
 *
 * @returns {{session: object|null, isOpen: boolean, savedCount: number, openNew: () => void, openExisting: (session: object) => void, close: () => void}}
 */
export function useSchedulingModal() {
  const context = useContext(SchedulingModalContext);

  if (!context) {
    throw new Error(
      "useSchedulingModal precisa estar dentro de <SchedulingModalProvider>.",
    );
  }

  return context;
}