import { createContext, useState } from "react";

import ModalNovoAgendamento from "../components/ModalNovoAgendamento";

export const AgendamentoContext = createContext({});

export const ModalAgendamentoContextProvider = ({ children }) => {
  const [agendamento, setAgendamento] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const openModal = (agendamento) => {
    console.log(agendamento);
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
};
