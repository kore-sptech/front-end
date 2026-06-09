import { AlertCircle, Calendar, Package } from "lucide-react";

export default function CardNotificacoes({ alert }) {
  // Define as cores e o ícone com base no tipo de alerta do protótipo
  const getStyleConfig = (type) => {
    switch (type) {
      case "CRITICO":
        return {
          border: "border-l-4 border-l-[#F87171]", // Vermelho / Rosa 
          bgIcon: "bg-[#F87171]/10 text-[#F87171]",
          icon: <Package size={20} />,
        };
      case "ATENCAO":
        return {
          border: "border-l-4 border-l-[#FB923C]", // Laranja para validade/atenção
          bgIcon: "bg-[#FB923C]/10 text-[#FB923C]",
          icon: <AlertCircle size={20} />,
        };
      case "INFORMATIVO":
      default:
        return {
          border: "border-l-4 border-l-[#22D3EE]", // Ciano para próximas sessões
          bgIcon: "bg-[#22D3EE]/10 text-[#22D3EE]",
          icon: <Calendar size={20} />,
        };
    }
  };

  const style = getStyleConfig(alert.tipo);

  return (
    <div className={`flex w-full items-start justify-between rounded-xl bg-[#061639] p-4 border border-gray-800/40 ${style.border}`}>
      <div className="flex gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${style.bgIcon}`}>
          {style.icon}
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-white">{alert.titulo}</h3>
          <p className="text-sm text-gray-400 max-w-xl">{alert.descricao}</p>
          
          {alert.tipo === "CRITICO" && (
            <div className="mt-3 flex gap-4 text-xs font-bold uppercase tracking-wider">
              <button className="text-[#22D3EE] hover:underline cursor-pointer">Fazer Pedido</button>
              <button className="text-gray-500 hover:text-gray-400 cursor-pointer">Ignorar</button>
            </div>
          )}
          {alert.tipo === "INFORMATIVO" && alert.hasDetails && (
            <div className="mt-3 gap-4 text-xs font-bold uppercase tracking-wider">
              <button className="text-[#22D3EE] hover:underline cursor-pointer">Ver Detalhes</button>
            </div>
          )}
        </div>
      </div>

      <span className="text-xs uppercase text-gray-500 font-semibold whitespace-nowrap">
        {alert.tempo}
      </span>
    </div>
  );
}