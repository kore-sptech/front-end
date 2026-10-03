const TONES = {
  cyan: {
    label: "text-cyan-400",
    value: "text-white",
    description: "text-gray-500",
    icon: "text-white",
  },
  red: {
    label: "text-red-400",
    value: "text-white",
    description: "text-gray-500",
    icon: "text-white",
  },
  neutral: {
    label: "text-gray-300",
    value: "text-white",
    description: "text-gray-500",
    icon: "text-white",
  },
};

/**
 * Molecule: card de métrica (label, valor, descrição e ícone).
 *
 * @param {object} props
 * @param {string} props.label
 * @param {React.ReactNode} props.value
 * @param {React.ReactNode} [props.description]
 * @param {"cyan"|"red"|"neutral"} [props.tone]
 * @param {React.ReactNode} [props.icon] Ícone decorativo no canto.
 * @param {React.ReactNode} [props.footer] Conteúdo abaixo da descrição.
 */
export default function MetricCard({
  label,
  value,
  description,
  tone = "cyan",
  icon,
  footer,
  className = "",
}) {
  const styles = TONES[tone] ?? TONES.cyan;

  return (
    <div
      className={`relative flex h-35 flex-col justify-around rounded-2xl border border-white/10 bg-[#061639] p-4.5 text-xs font-bold ${className}`}
    >
      <p className={styles.label}>{label}</p>
      <p className={`text-3xl font-extrabold ${styles.value}`}>{value}</p>
      {description && <p className={styles.description}>{description}</p>}

      {icon && (
        <div
          aria-hidden="true"
          className={`absolute top-4 right-4 flex h-10 w-10 items-center justify-center ${styles.icon}`}
        >
          {icon}
        </div>
      )}

      {footer}
    </div>
  );
}