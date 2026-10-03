import { Search } from "lucide-react";

/**
 * Molecule: campo de busca com ícone.
 *
 * @param {object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange Recebe o valor, não o evento.
 * @param {string} [props.placeholder]
 */
export default function SearchInput({
  value = "",
  onChange,
  placeholder = "Pesquisar...",
  disabled = false,
  ariaLabel = "Campo de busca",
  className = "",
}) {
  return (
    <label
      className={`input w-full rounded-2xl border-0 bg-[#0A1A3D] shadow-none hover:duration-150 ${className}`}
    >
      <Search size={18} className="opacity-50" aria-hidden="true" />
      <input
        type="search"
        className="grow"
        placeholder={placeholder}
        aria-label={ariaLabel}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </label>
  );
}