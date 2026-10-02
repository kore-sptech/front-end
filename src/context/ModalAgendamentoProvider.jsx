import { useState } from "react";

import ModalNovoAgendamento from "../components/ModalNovoAgendamento";
import { AgendamentoContext } from "./ContextoAgendamento";

export function ModalAgendamentoContextProvider({ children }) {
  const [agendamento, setAgendamento] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (agendamento) => {
    setAgendamento(agendamento);
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
    setAgendamento(null);
  };

  return (
    <AgendamentoContext.Provider
      value={{ isOpen, setIsOpen, agendamento, setAgendamento, openModal }}
    >
      {children}
      <ModalNovoAgendamento isOpen={isOpen} onClose={onClose} />
    </AgendamentoContext.Provider>
  );
}
