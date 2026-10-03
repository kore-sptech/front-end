import { SchedulingModalContext } from "./schedulingModalContext";
import SessionModal from "../ui/organisms/SessionModal";
import { useCallback, useMemo, useState } from "react";

/**
 * Organismo de estado: dono do modal de agendamento.
 *
 * Antes existiam dois caminhos concorrentes (provider global montando o modal
 * e a página montando o seu próprio). Agora existe um único modal, controlado
 * aqui, capaz de abrir tanto um agendamento novo quanto um existente.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {() => void} [props.onSaved] Disparado após salvar ou mudar status.
 */
export function SchedulingModalProvider({ children, onSaved }) {
  const [session, setSession] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const openNew = useCallback(() => {
    setSession(null);
    setIsOpen(true);
  }, []);

  const openExisting = useCallback((agendamento) => {
    setSession(agendamento);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setSession(null);
  }, []);

  const handleSaved = useCallback(() => {
    setSavedCount((count) => count + 1);
    onSaved?.();
  }, [onSaved]);

  const value = useMemo(
    () => ({ session, isOpen, savedCount, openNew, openExisting, close }),
    [close, isOpen, openExisting, openNew, savedCount, session],
  );

  return (
    <SchedulingModalContext.Provider value={value}>
      {children}
      <SessionModal
        isOpen={isOpen}
        session={session}
        onClose={close}
        onSaved={handleSaved}
      />
    </SchedulingModalContext.Provider>
  );
}
