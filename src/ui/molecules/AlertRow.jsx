/**
 * Molecule: linha de alerta/notificação (ícone, título, descrição, ações, tempo).
 *
 * @param {object} props
 * @param {React.ReactNode} props.icon
 * @param {string} [props.iconClassName] Classes do container do ícone.
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description]
 * @param {React.ReactNode} [props.time]
 * @param {React.ReactNode} [props.actions] Ações renderizadas abaixo da descrição.
 */
export default function AlertRow({
  icon,
  iconClassName = "",
  title,
  description,
  time,
  actions,
  className = "",
}) {
  return (
    <div
      className={`flex w-full items-start justify-between rounded-xl border border-gray-800/40 bg-[#061639] p-4 ${className}`}
    >
      <div className="flex gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
        >
          {icon}
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          {description && (
            <p className="max-w-xl text-sm text-gray-400">{description}</p>
          )}
          {actions}
        </div>
      </div>

      {time && (
        <span className="text-xs font-semibold whitespace-nowrap text-gray-500 uppercase">
          {time}
        </span>
      )}
    </div>
  );
}