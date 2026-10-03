import { Check } from "lucide-react";

/**
 * Molecule: linha selecionável com checkbox (itens de estoque).
 *
 * @param {object} props
 * @param {boolean} props.isSelected
 * @param {() => void} props.onToggle
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.details] Metadados (valor, validade...).
 */
export default function CheckboxRow({
  isSelected,
  onToggle,
  title,
  details,
  className = "",
}) {
  return (
    <div
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggle?.();
        }
      }}
      className={`flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-700/50 bg-[#0A1A3D] p-4 transition-all hover:border-cyan-400/30 hover:bg-[#0f2352] ${className}`}
    >
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
          isSelected
            ? "border-cyan-400 bg-cyan-400"
            : "border-gray-600 bg-transparent"
        }`}
      >
        {isSelected && <Check size={16} className="text-black" />}
      </div>

      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-200">{title}</h3>
        {details && (
          <div className="mt-1 flex gap-4 text-xs text-gray-400">{details}</div>
        )}
      </div>
    </div>
  );
}