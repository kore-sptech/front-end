/**
 * Molecule: cartão de acesso das telas de autenticação.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {React.ReactNode} props.children Formulário.
 * @param {React.ReactNode} [props.footer] Link para a outra tela de acesso.
 */
export default function AuthCard({ title, children, footer }) {
  return (
    <div className="w-full max-w-md rounded-xl border border-cyan-500/10 bg-[#0a1f4b]/80 p-10 shadow-2xl backdrop-blur-lg">
      <h2 className="mb-6 text-3xl font-bold">{title}</h2>

      {children}

      {footer && (
        <p className="mt-6 text-center text-sm text-gray-400">{footer}</p>
      )}
    </div>
  );
}