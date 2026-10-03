const CONTAINER = {
  tabs: "flex gap-2 rounded-lg border border-gray-800 bg-[#061639]/40 p-1",
  chips: "flex flex-wrap gap-3 text-sm font-medium text-[#dae2ffb4]",
};

const ITEM = {
  tabs: (isActive) =>
    `cursor-pointer rounded-md border px-4 py-1.5 text-xs font-bold tracking-wider transition-all ${
      isActive
        ? "border-[#22D3EE]/30 bg-[#1E3A8A]/50 text-[#22D3EE]"
        : "border-transparent text-gray-400 hover:text-white"
    }`,
  chips: (isActive) =>
    `cursor-pointer rounded-2xl px-5 py-2 transition-colors ${
      isActive ? "selecionado" : "hover:text-white"
    }`,
};

/**
 * Molecule: grupo de filtros em abas (notifications) ou chips (categorias).
 *
 * @param {object} props
 * @param {Array<{value: string, label: string}>} props.options
 * @param {string} props.value Valor ativo.
 * @param {(value: string) => void} props.onChange
 * @param {"tabs"|"chips"} [props.variant]
 */
export default function FilterChips({
  options = [],
  value,
  onChange,
  variant = "tabs",
  className = "",
}) {
  return (
    <div className={`${CONTAINER[variant] ?? CONTAINER.tabs} ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange?.(option.value)}
          className={(ITEM[variant] ?? ITEM.tabs)(option.value === value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}