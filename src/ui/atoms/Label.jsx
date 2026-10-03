const TONES = {
  default: "text-gray-400",
  accent: "text-cyan-400",
  strong: "text-[#BBC9CD]",
};

/**
 * Atom: rótulo de formulário.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {"default"|"accent"|"strong"} [props.tone]
 * @param {boolean} [props.uppercase] Aplica caixa alta (padrão da UI KORE).
 */
export default function Label({
  children,
  tone = "default",
  uppercase = true,
  htmlFor,
  className = "",
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={[
        "text-xs font-bold",
        uppercase ? "uppercase" : "",
        TONES[tone] ?? TONES.default,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </label>
  );
}