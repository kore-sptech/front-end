/**
 * Molecule: cabeçalho de página com título, traço de destaque e slot de ações.
 *
 * @param {object} props
 * @param {string} props.title Título da tela (uppercase por padrão).
 * @param {React.ReactNode} [props.subtitle] Linha de apoio abaixo do título.
 * @param {React.ReactNode} [props.actions] Botões/ações alinhados à direita.
 * @param {React.ReactNode} [props.children] Inserido entre título e ações.
 */
export default function PageHeader({
  title,
  subtitle,
  actions,
  children,
  className = "",
  titleClassName = "",
}) {
  return (
    <header
      className={`flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between ${className}`}
    >
      <div className="flex flex-col gap-2">
        <h1 className={`text-4xl font-bold text-[#DAE2FF] ${titleClassName}`}>
          {title}
        </h1>
        <span className="block h-1 w-12 rounded-3xl bg-[#48DCFC]" />
        {subtitle && <p className="text-sm text-[#BBC9CD]">{subtitle}</p>}
      </div>

      {children}

      {actions && (
        <div className="flex items-center gap-3">{actions}</div>
      )}
    </header>
  );
}