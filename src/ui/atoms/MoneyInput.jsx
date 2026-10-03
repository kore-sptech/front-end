import Control from "./Control";

/**
 * Atom: campo monetário maskado visualmente.
 * A máscara (dígitos → BRL) fica em `hooks/useMoneyInput.js`.
 *
 * @param {object} props
 * @param {string} props.value Texto exibido (ex.: "R$ 1.234,56").
 * @param {(event: React.ChangeEvent<HTMLInputElement>) => void} props.onChange
 */
export default function MoneyInput({
  value = "",
  onChange,
  placeholder = "R$ 0,00",
  ariaLabel = "Campo de valor monetário",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <Control
      type="text"
      inputMode="numeric"
      placeholder={placeholder}
      aria-label={ariaLabel}
      disabled={disabled}
      value={value}
      onChange={onChange}
      className={className}
      {...props}
    />
  );
}