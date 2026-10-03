/**
 * Atom: avatar de iniciais com indicador opcional de presence.
 *
 * @param {object} props
 * @param {string} props.initials Iniciais exibidas (1 a 2 caracteres).
 * @param {boolean} [props.online] Exibe o ponto de status.
 * @param {string} [props.size] Classes de dimensionamento do container.
 */
export default function Avatar({
  initials,
  online = false,
  size = "h-14 w-14 text-xl",
  className = "",
}) {
  return (
    <div className={`avatar avatar-placeholder ${className}`}>
      <div
        className={`mb-3 rounded-full border border-gray-500/20 bg-[#010d27] text-neutral-content ${size}`}
      >
        <span className="font-bold">{initials}</span>
      </div>

      {online && <span className="avatar-online" aria-hidden="true" />}
    </div>
  );
}