/**
 * Molecule: variação percentual com ícone direcional.
 *
 * @param {object} props
 * @param {number} props.value Percentual (ex.: 12.5).
 * @param {string} [props.suffix] Texto após o percentual.
 * @param {"positive"|"negative"|"auto"} [props.tone]
 */
export default function VariationIndicator({
  value,
  suffix = "",
  tone = "auto",
  className = "",
}) {
  const isPositive = value >= 0;
  const resolvedTone = tone === "auto" ? (isPositive ? "positive" : "negative") : tone;

  return (
    <p
      className={`flex items-center gap-2 text-sm ${
        resolvedTone === "positive"
          ? "text-cyan-400"
          : resolvedTone === "negative"
            ? "text-red-400"
            : "text-gray-400"
      } ${className}`}
    >
      {suffix && <span>{suffix}</span>}
      <span>
        {isPositive && value > 0 ? "+" : ""}
        {value.toFixed(1)}%
      </span>
    </p>
  );
}