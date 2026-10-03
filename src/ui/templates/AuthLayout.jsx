import Logo from "../atoms/Logo";

/**
 * Template: shell das telas públicas de acesso (login e cadastro).
 *
 * Mantém o layout original: imagem de fundo com gradiente, cabeçalho fixo com
 * a logo, coluna esquerda com o texto de apresentação e rodapé.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children Cartão de acesso.
 * @param {React.ReactNode} [props.highlight] Trecho em destaque do título.
 * @param {string} [props.title] Título da coluna esquerda.
 * @param {string} [props.subtitle] Texto de apoio do título.
 */
export default function AuthLayout({
  children,
  title,
  highlight,
  subtitle,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#021134] text-white">
      <div className="absolute inset-0">
        <img
          className="h-full w-full object-cover opacity-60"
          src="/back-ground-login.png"
          alt=""
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/80" />
      </div>

      <header className="fixed top-0 z-50 w-full px-12 py-8">
        <Logo />
      </header>

      <main className="relative z-10 grid min-h-screen grid-cols-12">
        <div className="col-span-7 hidden flex-col justify-end p-12 lg:flex">
          <div>
            <h1 className="mb-4 text-6xl font-bold">
              {title} {highlight && <span className="text-cyan-400">{highlight}</span>}
            </h1>
            <p className="text-gray-300">{subtitle}</p>
          </div>
        </div>

        <div className="col-span-12 flex items-center justify-center px-6 lg:col-span-5">
          {children}
        </div>
      </main>

      <footer className="absolute bottom-0 w-full py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Kore Studio
      </footer>
    </div>
  );
}