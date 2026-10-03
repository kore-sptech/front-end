/**
 * Atom: barra de progresso horizontal.
 *
 * @param {object} props
 * @param {number} props.value Valor atual.
 * @param {number} [props.max] Valor máximo (padrão 100).
 * @param {string} [props.className] Classes do trilho.
 * @param {string} [props.indicatorClassName] Classes do preenchimento.
 */
export default function ProgressBar({
  value = 0,
  max = 100,
  className = "",
  indicatorClassName = "bg-[#48DCFC]",
}) {
  const safeMax = max > 0 ? max : 100;
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const percentage = (safeValue / safeMax) * 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
      className={`h-1 w-full rounded-full bg-gray-700 ${className}`}
    >
      <div
        className={`h-1 rounded-full transition-all duration-500 ${indicatorClassName}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}