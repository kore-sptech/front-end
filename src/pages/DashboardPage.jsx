import { ArrowLeftRight, Bell, Clock, Home, Package } from "lucide-react";

export default function DashboardPage() {
  const links = [
    {
      path: "/dashboard",
      name: "Paginal Inicial",
      target: true,
      icon: <Home />,
    },
    {
      path: "/calender",
      name: "Agendamento",
      target: false,
      icon: <Clock />,
    },
    {
      path: "/finance",
      name: "Financeiro",
      target: false,
      icon: <ArrowLeftRight />,
    },
    {
      path: "/packages",
      name: "Pacotes",
      target: false,
      icon: <Package />,
    },
    {
      path: "/notigications",
      name: "Notificações",
      target: false,
      icon: <Bell />,
    },
  ];

  return (
    <main className="h-screen w-full flex bg-[#000C24]">
      <aside className="w-1/7 bg-[#061639] px-5 py-10 text-white border-r relative">
        <h2 className="text-4xl font-normal text-center mb-14">
          Jefferson <br />
          Pimentel <br />
          <span className="text-4xl font-extrabold">Tattoo</span>
        </h2>

        <span className="h-0.5 w-full bg-white rounded-3xl block mb-10"></span>

        <div className="flex flex-col justify-stretch gap-6 ">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.path}
              className={`relative flex gap-2 items-center  text-lg   duration-200 px-4  py-3 rounded-lg hover:bg-white hover:text-[#061639] transition-colors ${link.target ? "bg-white text-[#061639]" : ""} ${link.target ? "font-semibold" : "font-normal"}`}
            >
              {link.icon}
              {link.name}
            </a>
          ))}
        </div>

        <footer className="absolute bottom-8  opacity-50 text-lg left-1/2 right-1/2 transform -translate-x-1/2 w-40 text-center">
          Desenvolvido por: <br /> <span className="font-bold">KORE</span> ©
          <span className="font-bold">2026</span>
        </footer>
      </aside>
    </main>
  );
}
