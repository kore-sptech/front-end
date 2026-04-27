import { ArrowLeftRight, Bell, Clock, Home, Package } from "lucide-react";
import AsideBar from "../components/Aside";
import Navbar from "../components/Navbar";
import Kpi from "../components/Kpi";
import GraficoBarra from "../components/GraficoBarra";
import Barra from "../components/Barra";
import Lucro from "../assets/Lucro.png";
import Agendamentos from "../assets/Agendamentos.png";
import Ocupacao from "../assets/Ocupacao.png";
import "../index.css"
import Alerta from "../assets/alerta.png"
import ItemCritico from "../components/ItemCritico";
import Notificacao from "../components/Notificacao";
import Pagamento from "../assets/Pagamento.png";
import Mensagem from "../assets/Mensagem.png";

export default function DashboardPage() {

  const kpi1 = {
    titulo: "LUCRO LÍQUIDO",
    valor: "R$ 10.000",
    descricaoValor: "+12.5%",
    descricaoIndividual: "em relação ao mês passado",
    icone: Lucro
  };

  const kpi2 = {
    titulo: "AGENDAMENTOS",
    valor: "142",
    descricaoValor: "+5 novos",
    descricaoIndividual: "no último mês",
    icone: Agendamentos
  };

  const kpi3 = {
    titulo: "OCUPAÇÃO",
    valor: "88%",
    descricaoValor: <Barra valor={88}/>,
    descricaoIndividual: "",
    icone: Ocupacao
  };

  const alerta1 = {
    titulo: "Estoque Baixo: Agulhas RL-03",
    descricao: "Apenas 5 unidades restantes no inventário principal."
  }

  const alerta2 = {
    titulo: "Estoque Baixo: Luvas",
    descricao: "Apenas 2 unidades restantes no inventário principal."
  }

  const alerta3 = {
    titulo: "Estoque Baixo: Tintas",
    descricao: "Apenas 8 unidades restantes no inventário principal."
  }

  const notificacao1 = {
    icone: Pagamento,
    titulo: "Pagamento recebido!",
    descricao: "Sessão finalizada - Valor R$ 850,00",
    tempo: "Há 20 minutos"
  }

  const notificacao2 = {
    icone: Pagamento,
    titulo: "Compra efetuada!",
    descricao: "Material X - Valor R$ 300,00",
    tempo: "Há 42 minutos"
  }

  const notificacao3 = {
    icone: Pagamento,
    titulo: "Pagamento recebido!",
    descricao: "Sessão finalizada - Valor R$ 530,00",
    tempo: "Há 2 horas"
  }

  const notificacao4 = {
    icone: Mensagem,
    titulo: "Agendamento realizado!",
    descricao: "Sessão Marcada - Data: 15/07/2026",
    tempo: "Há 3 horas"
  }

  return (
    <main className="min-h-screen w-full flex bg-[#021134] overflow-x-hidden">
    
        <AsideBar></AsideBar>
      
        <div className="flex-1 flex flex-col">
          
          <Navbar></Navbar>
          <div className="grid h-30 mt-10 grid-cols-3 gap-5 w-full px-5"> 

              <Kpi {...kpi1}></Kpi>
  
              <Kpi {...kpi2}></Kpi>

              <Kpi {...kpi3}></Kpi>  

          </div>

          <div className="grid w-full grid-cols-3 gap-5 mt-10 mb-5 px-5">

            <div className="bg-[#132247] col-span-2 min-h-auto h-100 p-4.5 rounded-2xl border-1 border-white/10 text-white font-bold text-xs">

              <h1 className="text-2xl m-5">Receita total do mês</h1>

              <GraficoBarra />
              
            </div>

            <div className="bg-[#132247] text-white col-span-1 p-3 rounded-2xl border border-white/10 ">              
              
              <div className="text-2xl m-5 flex">
                <img src={Alerta} alt="icone Alerta" className="w-6 h-5 mt-2 mr-3 pr-0.5"/>
                <h1>Itens críticos</h1>
              </div>
              
              <div className="flex flex-col items-center max-h-[300px] overflow-y-auto">
                <ItemCritico {...alerta1}></ItemCritico>
                <ItemCritico {...alerta2}></ItemCritico>
                <ItemCritico {...alerta3}></ItemCritico>
              </div>
              
            </div>

          </div>

          <div className="grid grid-cols-3 gap-5 mb-10 px-5">

            <div className="bg-[#132247] text-white col-span-3 p-3 rounded-2xl border border-white/10 ">              
              
              <div className="text-2xl m-5 flex justify-between">
                <h1>Notificações</h1>
                <button onClick="" className="text-sm text-blue-300 p-2 flex flex-col justify-around">Limpar notificações</button>
              </div>
              
              <div className="flex flex-col items-center max-h-[300px] overflow-y-auto">
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
