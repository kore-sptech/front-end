/**
 * Molecule: painel de seção (superfície + cabeçalho + conteúdo).
 *
 * @param {object} props
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.actions] Ações do cabeçalho.
 * @param {React.ReactNode} [props.footer] Rodapé do painel.
 * @param {string} [props.bodyClassName] Classes da área de conteúdo.
 */
export default function Panel({
  title,
  actions,
  footer,
  children,
  className = "",
  bodyClassName = "",
  titleClassName = "text-xl font-bold",
}) {
  return (
    <section
      className={`rounded-2xl border border-gray-800 bg-[#061639] p-8 ${className}`}
    >
      {(title || actions) && (
        <header className="mb-6 flex items-center justify-between gap-4">
          {title && <h2 className={titleClassName}>{title}</h2>}
          {actions}
        </header>
      )}

      <div className={bodyClassName}>{children}</div>

      {footer}
    </section>
  );
}