import { AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const SHAKE = "shake";

/**
 * Atom: campo de formulário com rótulo, ícone, mensagem de erro e animação de
 * "shake" sempre que a mensagem de erro muda de valor.
 *
 * @param {object} props
 * @param {React.ReactNode} props.label Rótulo do campo.
 * @param {string} [props.error] Mensagem de erro exibida abaixo do controle.
 * @param {React.ReactNode} [props.icon] Ícone absoluto à esquerda do controle.
 * @param {boolean} [props.hideLabel] Oculta visualmente o rótulo (mantém o leitor de tela).
 * @param {React.ReactNode} [props.hint] Texto auxiliar à direita do rótulo.
 * @param {string} [props.controlId] id do controle controlado.
 */
export default function Field({
  label,
  error,
  icon,
  hint,
  hideLabel = false,
  className = "",
  labelClassName = "",
  controlId,
  children,
}) {
  const [shaking, setShaking] = useState(false);
  const previousError = useRef(undefined);

  useEffect(() => {
    if (error && error !== previousError.current) {
      setShaking(true);
    }
    previousError.current = error;
  }, [error]);

  const describedBy = error && controlId ? `${controlId}-error` : undefined;
  const control =
    typeof children === "function"
      ? children({ describedBy })
      : children;

  return (
    <div className={className}>
      {(label || hint) && (
        <label
          htmlFor={controlId}
          className={[
            "mb-1.5 flex items-center justify-between text-xs font-bold tracking-widest uppercase",
            hideLabel ? "sr-only" : "text-gray-500",
            labelClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span>{label}</span>
          {hint && (
            <span className="tracking-normal text-gray-400 normal-case">
              {hint}
            </span>
          )}
        </label>
      )}

      <div
        className={`relative ${shaking ? SHAKE : ""}`}
        onAnimationEnd={() => setShaking(false)}
      >
        {icon && (
          <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-gray-600">
            {icon}
          </span>
        )}
        {control}
      </div>

      {error && (
        <p
          id={describedBy}
          role="alert"
          className="mt-1.5 flex items-center gap-1.5 text-[11px] text-red-400"
        >
          <AlertCircle size={12} className="shrink-0 text-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}