const TONES = {
  cyan: "bg-[#48dbfc1a] text-[#48DCFC]",
  neutral: "bg-white/5 text-gray-300",
  success: "bg-cyan-400/20 text-cyan-400",
  danger: "bg-red-400/20 text-red-400",
  warning: "bg-orange-400/20 text-orange-400",
};

const SIZES = {
  sm: "px-3 py-1 text-[10px]",
  md: "px-4 py-2 text-sm",
};

/**
 * Atom: etiqueta (pill) usada para status, valores e contadores.
 *
 * @param {object} props
 * @param {"cyan"|"neutral"|"success"|"danger"|"warning"} [props.tone]
 * @param {"sm"|"md"} [props.size]
 */
export default function Badge({
  children,
  tone = "cyan",
  size = "md",
  className = "",
}) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-semibold",
        TONES[tone] ?? TONES.cyan,
        SIZES[size] ?? SIZES.md,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}