import Spinner from "./Spinner";

const VARIANTS = {
  primary:
    "bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] text-[#003640] shadow-xl shadow-cyan-500/20 hover:brightness-105",
  accent:
    "bg-cyan-400 text-black shadow-lg shadow-cyan-400/20 hover:bg-cyan-300",
  outline:
    "border border-[#48DCFC] text-[#48DCFC] hover:bg-[#48DCFC]/10 hover:brightness-110",
  neutral:
    "border border-gray-600 bg-transparent text-gray-400 hover:bg-gray-800 hover:text-gray-300",
  danger:
    "border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20",
  subtle: "border border-gray-800 bg-[#061639] text-gray-400 hover:text-white",
  ghost: "bg-transparent text-gray-400 hover:bg-white/5 hover:text-white",
};

const SIZES = {
  sm: "gap-1.5 rounded-lg px-4 py-2 text-xs",
  md: "gap-2 rounded-xl px-6 py-2.5 text-sm",
  lg: "gap-2 rounded-xl px-10 py-4 text-base",
  block: "w-full gap-2 rounded-lg py-4 text-sm tracking-widest uppercase",
};

/**
 * Atom: botão do design system KORE.
 *
 * @param {object} props
 * @param {"button"|"a"} [props.as] Elemento renderizado.
 * @param {"primary"|"accent"|"outline"|"neutral"|"danger"|"subtle"|"ghost"} [props.variant]
 * @param {"sm"|"md"|"lg"|"block"} [props.size]
 * @param {boolean} [props.fullWidth] Estende o botão para 100% do contêiner.
 * @param {boolean} [props.loading] Exibe spinner e bloqueia a ação.
 * @param {string} [props.loadingLabel] Texto exibido enquanto `loading` estiver ativo.
 */
export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  loadingLabel,
  disabled = false,
  type = "button",
  className = "",
  children,
  ...props
}) {
  const buttonType = Component === "button" ? type : undefined;

  return (
    <Component
      type={buttonType}
      disabled={disabled || loading}
      data-loading={loading || undefined}
      className={[
        "inline-flex cursor-pointer items-center justify-center font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none",
        VARIANTS[variant] ?? VARIANTS.primary,
        SIZES[size] ?? SIZES.md,
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={size === "lg" ? 20 : 16} />
          <span>{loadingLabel ?? children}</span>
        </>
      ) : (
        children
      )}
    </Component>
  );
}
