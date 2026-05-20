import "../index.css";

import Agendamentos from "../assets/Agendamentos.png";
import Alerta from "../assets/alerta.png";
import AsideBar from "../components/Aside";
import Barra from "../components/Barra";
import GraficoBarra from "../components/GraficoBarra";
import ItemCritico from "../components/ItemCritico";
import Kpi from "../components/Kpi";
import Lucro from "../assets/Lucro.png";
import Mensagem from "../assets/Mensagem.png";
import Navbar from "../components/Navbar";
import Notificacao from "../components/Notificacao";
import Ocupacao from "../assets/Ocupacao.png";
import Pagamento from "../assets/Pagamento.png";
import Sidebar from "../components/Sidebar";

export default function DashboardPage() {
  const kpi1 = {
    titulo: "LUCRO LÍQUIDO",
    valor: "R$ 10.000",
    descricaoValor: "+12.5%",
    descricaoIndividual: "em relação ao mês passado",
    icone: Lucro,
  };

  const kpi2 = {
    titulo: "AGENDAMENTOS",
    valor: "142",
    descricaoValor: "+5 novos",
    descricaoIndividual: "no último mês",
    icone: Agendamentos,
  };

  const kpi3 = {
    titulo: "OCUPAÇÃO",
    valor: "88%",
    descricaoValor: <Barra valor={88} />,
    descricaoIndividual: "",
    icone: Ocupacao,
  };

  const alerta1 = {
    titulo: "Estoque Baixo: Agulhas RL-03",
    descricao: "Apenas 5 unidades restantes no inventário principal.",
  };

  const alerta2 = {
    titulo: "Estoque Baixo: Luvas",
    descricao: "Apenas 2 unidades restantes no inventário principal.",
  };

  const alerta3 = {
    titulo: "Estoque Baixo: Tintas",
    descricao: "Apenas 8 unidades restantes no inventário principal.",
  };

  const notificacao1 = {
    icone: Pagamento,
    titulo: "Proxima sessao em 20 minutos",
    descricao: "",
    tempo: "Há 20 minutos",
  };

  const notificacao2 = {
    icone: Pagamento,
    titulo: "Compra efetuada!",
    descricao: "Material X - Valor R$ 300,00",
    tempo: "Há 42 minutos",
  };

  const notificacao3 = {
    icone: Pagamento,
    titulo: "Pagamento recebido!",
    descricao: "Sessão finalizada - Valor R$ 530,00",
    tempo: "Há 2 horas",
  };

  const notificacao4 = {
    icone: Mensagem,
    titulo: "Agendamento realizado!",
    descricao: "Sessão Marcada - Data: 15/07/2026",
    tempo: "Há 3 horas",
  };

  return (
    <main className="relative flex min-h-screen w-full overflow-x-hidden bg-[#021134] text-[#DAE2FF]">
      <Sidebar></Sidebar>

      <div className="flex flex-1 flex-col">
        {/* <Navbar></Navbar> */}
        <div className="mt-10 grid h-30 w-full grid-cols-3 gap-5 px-5">
          <Kpi {...kpi1}></Kpi>

          <Kpi {...kpi2}></Kpi>

          <Kpi {...kpi3}></Kpi>
        </div>

        <div className="mt-10 mb-5 grid w-full grid-cols-3 gap-5 px-5">
          <div className="col-span-2 h-100 min-h-auto rounded-2xl border-1 border-white/10 bg-[#132247] p-4.5 text-xs font-bold text-white">
            <h1 className="m-5 text-2xl">Receita total do mês</h1>

            <GraficoBarra />
          </div>

          <div className="col-span-1 rounded-2xl border border-white/10 bg-[#132247] p-3 text-white">
            <div className="m-5 flex text-2xl">
              <img
                src={Alerta}
                alt="icone Alerta"
                className="mt-2 mr-3 h-5 w-6 pr-0.5"
              />
              <h1>Itens críticos</h1>
            </div>

            <div className="flex max-h-[300px] flex-col items-center overflow-y-auto">
              <ItemCritico {...alerta1}></ItemCritico>
              <ItemCritico {...alerta2}></ItemCritico>
              <ItemCritico {...alerta3}></ItemCritico>
            </div>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-3 gap-5 px-5">
          <div className="col-span-3 rounded-2xl border border-white/10 bg-[#132247] p-3 text-white">
            <div className="m-5 flex justify-between text-2xl">
              <h1>Notificações</h1>
              <button
                onClick=""
                className="flex flex-col justify-around p-2 text-sm text-blue-300"
              >
                Limpar notificações
              </button>
            </div>

            <div className="flex max-h-[300px] flex-col items-center overflow-y-auto">
              <Notificacao {...notificacao1}></Notificacao>
              <Notificacao {...notificacao2}></Notificacao>
              <Notificacao {...notificacao3}></Notificacao>
              <Notificacao {...notificacao4}></Notificacao>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
