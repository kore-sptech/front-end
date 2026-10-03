const VARIANTS = {
  transparent:
    "border-transparent bg-transparent text-gray-500 hover:text-white hover:border-cyan-300",
  solid: "border-[#3C494D]/20 bg-[#0A1A3D] text-gray-500 hover:bg-[#0f2352]",
  chip: "border-[#bbc9cd70] bg-transparent text-white hover:border-cyan-400/50",
  dashed:
    "border-dashed border-[#bbc9cd70] bg-transparent text-gray-400 hover:border-cyan-400 hover:text-cyan-400",
};

const SIZES = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  tile: "h-24 w-24 flex-col gap-1",
  auto: "",
};

/**
 * Atom: botão compacto composto apenas por ícone.
 *
 * @param {object} props
 * @param {"transparent"|"solid"|"chip"|"dashed"} [props.variant]
 * @param {"sm"|"md"|"tile"|"auto"} [props.size]
 * @param {string} [props.label] Texto exibido ao lado do ícone (usado em `tile`).
 * @param {string} props.title Descrição accessible (tooltip nativo).
 */
export default function IconButton({
  children,
  variant = "transparent",
  size = "sm",
  label,
  title,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={[
        "flex cursor-pointer items-center justify-center rounded-lg transition-all",
        SIZES[size] ?? SIZES.sm,
        VARIANTS[variant] ?? VARIANTS.transparent,
        label ? "text-[10px]" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
      {label && <span>{label}</span>}
    </button>
  );
}