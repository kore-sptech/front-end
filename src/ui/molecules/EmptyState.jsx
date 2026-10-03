import Button from "../atoms/Button";

/**
 * Molecule: estado vazio com ação opcional.
 *
 * @param {object} props
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description] Texto auxiliar abaixo do título.
 * @param {{label: string, onClick: () => void}} [props.action] Ação em destaque.
 * @param {React.ReactNode} [props.icon] Ilustração opcional acima do título.
 */
export default function EmptyState({
  title,
  description,
  action,
  icon,
  className = "",
}) {
  return (
    <div
      className={`col-span-full flex flex-col items-center justify-center gap-3 py-16 text-center ${className}`}
    >
      {icon}

      {title && <h2 className="text-3xl font-bold text-[#DAE2FF]">{title}</h2>}

      {description && (
        <p className="max-w-md text-sm text-[#BBC9CD]">{description}</p>
      )}

      {action && (
        <Button variant="outline" className="mt-2" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}