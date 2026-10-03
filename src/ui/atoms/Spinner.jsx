import { Loader2 } from "lucide-react";

const SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 32,
};

/**
 * Atom: indicador de carregamento.
 *
 * @param {object} props
 * @param {"xs"|"sm"|"md"|"lg"} [props.size]
 * @param {string} [props.className] Classes extras (normalmente a cor do ícone).
 * @param {string} [props.label] Texto acessível lido por leitores de tela.
 */
export default function Spinner({
  size = "sm",
  className = "",
  label = "Carregando",
}) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <Loader2
        size={SIZES[size] ?? SIZES.sm}
        className={`animate-spin ${className}`}
      />
    </span>
  );
}