import { ArrowLeftRight, Calendar, Home } from "lucide-react";

import { useLocation } from "react-router-dom";

export default function AsideBar() {
  const links = [
    {
      path: "/dashboard",
      name: "Paginal Inicial",
      target: true,
      icon: <Home />,
    },
    {
      path: "/agendamentos",
      name: "Agendamento",
      target: false,
      icon: <Calendar />,
    },
    {
      path: "/dashboard-financeiro",
      name: "Financeiro",
      target: false,
      icon: <ArrowLeftRight />,
    },
  ];

  return (
    <aside className="flex w-1/7 min-w-[256px] flex-col bg-[#0A1A3D] py-6">
      <div className="mb-10 px-6">
        <h2 className="text-xl font-bold">KORE</h2>

        <p className="text-xs font-normal opacity-60">
          Gerenciamento de estúdio
        </p>
      </div>

      <div className="flex grow flex-col font-medium">
        {links.map((link, index) => (
          <AsideLink key={link.path} href={link.path} icon={link.icon}>
            {link.name}
          </AsideLink>
        ))}
      </div>

      <AsideFooter />
    </aside>
  );
}

function AsideLink({ href, icon, children }) {
  const location = useLocation();

  const isTarget = location.pathname.includes(href);

  return (
    <a
      href={href}
      className={`flex items-center justify-start gap-3 px-4 py-3 ${isTarget ? "border-l-4 border-[#0CC0DF] bg-[#263457]/30 text-[#0CC0DF] opacity-100" : "opacity-60"} transition-all hover:border-l-4 hover:border-[#0CC0DF] hover:bg-[#263457]/30 hover:text-[#0CC0DF] hover:opacity-100`}
    >
      <span>{icon}</span>
      <span>{children}</span>
    </a>
  );
}

function AsideFooter() {
  return (
    <footer className="flex items-center justify-center gap-2 text-xs opacity-40">
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 7H6C6.14167 7 6.26042 6.95208 6.35625 6.85625C6.45208 6.76042 6.5 6.64167 6.5 6.5V5.5H5.5V6H4.5V4H5.5V4.5H6.5V3.5C6.5 3.35833 6.45208 3.23958 6.35625 3.14375C6.26042 3.04792 6.14167 3 6 3H4C3.85833 3 3.73958 3.04792 3.64375 3.14375C3.54792 3.23958 3.5 3.35833 3.5 3.5V6.5C3.5 6.64167 3.54792 6.76042 3.64375 6.85625C3.73958 6.95208 3.85833 7 4 7ZM5 10C4.30833 10 3.65833 9.86875 3.05 9.60625C2.44167 9.34375 1.9125 8.9875 1.4625 8.5375C1.0125 8.0875 0.65625 7.55833 0.39375 6.95C0.13125 6.34167 0 5.69167 0 5C0 4.30833 0.13125 3.65833 0.39375 3.05C0.65625 2.44167 1.0125 1.9125 1.4625 1.4625C1.9125 1.0125 2.44167 0.65625 3.05 0.39375C3.65833 0.13125 4.30833 0 5 0C5.69167 0 6.34167 0.13125 6.95 0.39375C7.55833 0.65625 8.0875 1.0125 8.5375 1.4625C8.9875 1.9125 9.34375 2.44167 9.60625 3.05C9.86875 3.65833 10 4.30833 10 5C10 5.69167 9.86875 6.34167 9.60625 6.95C9.34375 7.55833 8.9875 8.0875 8.5375 8.5375C8.0875 8.9875 7.55833 9.34375 6.95 9.60625C6.34167 9.86875 5.69167 10 5 10ZM5 9C6.11667 9 7.0625 8.6125 7.8375 7.8375C8.6125 7.0625 9 6.11667 9 5C9 3.88333 8.6125 2.9375 7.8375 2.1625C7.0625 1.3875 6.11667 1 5 1C3.88333 1 2.9375 1.3875 2.1625 2.1625C1.3875 2.9375 1 3.88333 1 5C1 6.11667 1.3875 7.0625 2.1625 7.8375C2.9375 8.6125 3.88333 9 5 9Z"
          fill="#DAE2FF"
          fill-opacity="0.4"
        />
      </svg>
      <p>
        Desenvolvido por: KORE © <br /> {new Date().getFullYear()}
      </p>
    </footer>
  );
}
