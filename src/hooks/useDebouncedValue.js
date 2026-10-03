import { useEffect, useState } from "react";

/**
 * Hook: retorna o valor somente após `delay` ms sem alterações.
 * Usado nos campos de busca que disparam requisições.
 *
 * @template T
 * @param {T} value Valor original.
 * @param {number} [delay] Atraso em milissegundos.
 * @returns {T} Valor estabilizado.
 */
export function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}