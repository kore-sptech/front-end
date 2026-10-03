import { useCallback, useMemo, useState } from "react";

import { centsFromInput, maskCurrencyInput } from "../utils/money";

const toCents = (value) => Math.round(Number(value || 0) * 100);

/**
 * Hook: estado do campo monetário com máscara.
 * Substitui o par `valorDisplay`/`valorFloat` duplicado nos formulários.
 *
 * @param {number} [initialValue] Valor inicial em reais.
 * @returns {{value: string, numeric: number, handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void, setNumeric: (value: number) => void, reset: () => void}}
 */
export function useMoneyInput(initialValue = 0) {
  const [cents, setCents] = useState(() => toCents(initialValue));

  const value = useMemo(
    () => (cents > 0 ? `R$ ${maskCurrencyInput(cents)}` : ""),
    [cents],
  );

  const handleChange = useCallback((event) => {
    setCents(centsFromInput(event.target.value));
  }, []);

  const setNumeric = useCallback((next) => setCents(toCents(next)), []);

  const reset = useCallback(() => setCents(0), []);

  return { value, numeric: cents / 100, handleChange, setNumeric, reset };
}