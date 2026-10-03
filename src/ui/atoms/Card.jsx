const VARIANTS = {
  solid: "bg-[#061639] border border-white/10",
  raised: "bg-[#0A1A3D] border border-transparent",
  translucent: "bg-[#061639]/50 border border-gray-800",
  gradient:
    "bg-linear-to-br from-[#061639] to-cyan-900/30 border border-cyan-500/20 shadow-lg",
};

/**
 * Atom: superfície base dos cards da aplicação.
 *
 * @param {object} props
 * @param {"solid"|"raised"|"translucent"|"gradient"} [props.variant]
 * @param {boolean} [props.interactive] Cursor de clique e sombra no hover.
 * @param {() => void} [props.onClick]
 */
export default function Card({
  children,
  variant = "solid",
  interactive = false,
  onClick,
  role,
  tabIndex,
  className = "",
  ...props
}) {
  return (
    <div
      role={role ?? (onClick ? "button" : undefined)}
      tabIndex={tabIndex ?? (onClick ? 0 : undefined)}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick(event);
              }
            }
          : undefined
      }
      className={[
        "relative rounded-2xl",
        VARIANTS[variant] ?? VARIANTS.solid,
        interactive
          ? "cursor-pointer transition-all hover:shadow-cyan-300"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}