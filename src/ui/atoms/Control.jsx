import { useId } from "react";

const TONES = {
  neutral:
    "border-gray-800 bg-[#000C24] text-gray-300 focus:border-cyan-400",
  auth: "border-gray-600 bg-[#0f1e41] text-white placeholder:text-gray-600 focus:border-cyan-400",
  invalid:
    "border-red-500 bg-[#000C24] text-white focus:border-red-400 shadow-[0_0_0_1px_rgba(239,68,68,0.3)]",
  invalidAuth:
    "border-red-500 bg-[#0f1e41] text-white focus:border-red-400",
  transparent: "border-transparent bg-[#0A1A3D] text-white focus:border-cyan-400",
};

const WIDTHS = {
  default: "w-full",
  compact: "w-auto",
};

/**
 * Atom: controle de formulário (input, select, textarea) com a mesma API.
 *
 * @param {object} props
 * @param {"input"|"select"|"textarea"} [props.as] Elemento renderizado.
 * @param {boolean} [props.invalid] Aplica o estado de erro.
 * @param {"neutral"|"auth"|"invalid"|"invalidAuth"|"transparent"} [props.tone]
 * @param {"default"|"compact"} [props.width] Largura do controle.
 * @param {string} [props.ariaLabel] Rótulo acessível quando não há `Field`.
 * @param {React.ReactNode} [props.children] Opções, no caso de `as="select"`.
 */
export default function Control({
  as = "input",
  invalid = false,
  tone = "neutral",
  width = "default",
  className = "",
  id,
  children,
  "aria-describedby": ariaDescribedBy,
  ...props
}) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const Element = as;

  const toneKey = invalid && tone === "auth" ? "invalidAuth" : tone;

  return (
    <Element
      id={controlId}
      aria-invalid={invalid || undefined}
      aria-describedby={ariaDescribedBy}
      className={[
        WIDTHS[width] ?? WIDTHS.default,
        "rounded-lg border px-4 py-3 text-sm text-white transition-all duration-200 placeholder:text-gray-600 focus:outline-none",
        TONES[toneKey] ?? TONES.neutral,
        as === "textarea" ? "h-24 resize-y" : "",
        as === "select" ? "cursor-pointer appearance-none" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Element>
  );
}