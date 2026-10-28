import { AlertCircle, Calendar, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AlertRow from "./AlertRow";
import Button from "../atoms/Button";
import { ignorarNotificacao } from "../../services/notificacoes";

const TONES = {
  CRITICO: {
    container: "border-l-4 border-l-[#F87171]",
    icon: "bg-[#F87171]/10 text-[#F87171]",
    glyph: <Package size={20} />,
  },
  ATENCAO: {
    container: "border-l-4 border-l-[#FB923C]",
    icon: "bg-[#FB923C]/10 text-[#FB923C]",
    glyph: <AlertCircle size={20} />,
  },
  INFORMATIVO: {
    container: "border-l-4 border-l-[#22D3EE]",
    icon: "bg-[#22D3EE]/10 text-[#22D3EE]",
    glyph: <Calendar size={20} />,
  },
};

const DEFAULT_TONE = TONES.INFORMATIVO;

/**
 * Molecule: alerta de notificação com ação contextual por severidade e navegação correta para entidades.
 *
 * @param {object} props
 * @param {{id: number, tipo: "CRITICO"|"ATENCAO"|"INFORMATIVO", titulo: string,
 *   descricao: string, tempo: string, acaoTipo: string, entidadeTipo: string, entidadeId: number}} props.alert
 * @param {function} props.onDismiss Callback opcional ao ignorar/remover notificação.
 */
export default function AlertNotification({ alert, onDismiss }) {
  const tone = TONES[alert.tipo] ?? DEFAULT_TONE;
  const navigate = useNavigate();

  const handleAction = async () => {
    if (alert.entidadeId && (alert.acaoTipo === "REGISTRAR_PRODUTO" || alert.acaoTipo === "VER_ITEM" || alert.entidadeTipo === "STOCK")) {
      navigate(`/estoque/${alert.entidadeId}`);
    } else if (alert.entidadeId && (alert.acaoTipo === "VER_AGENDAMENTO" || alert.entidadeTipo === "APPOINTMENT")) {
      navigate("/agendamentos");
    } else {
      navigate("/notificacoes");
    }
  };

  const handleIgnore = async () => {
    try {
      await ignorarNotificacao(alert.id);
      if (onDismiss) {
        onDismiss(alert.id);
      } else {
        window.location.reload();
      }
    } catch (e) {
      console.error("Erro ao ignorar notificação", e);
    }
  };

  return (
    <AlertRow
      className={tone.container}
      icon={tone.glyph}
      iconClassName={tone.icon}
      title={alert.titulo}
      description={alert.descricao}
      time={alert.tempo}
      actions={
        <div className="mt-3 flex gap-4 text-xs font-bold tracking-wider uppercase">
          {alert.tipo === "CRITICO" && (
            <Button variant="ghost" size="sm" className="px-0 text-[#22D3EE]" onClick={handleAction}>
              Registrar Produto
            </Button>
          )}
          {alert.tipo === "ATENCAO" && (
            <Button variant="ghost" size="sm" className="px-0 text-[#22D3EE]" onClick={handleAction}>
              Ver Item
            </Button>
          )}
          {alert.tipo === "INFORMATIVO" && (
            <Button variant="ghost" size="sm" className="px-0 text-[#22D3EE]" onClick={handleAction}>
              Ver Detalhes
            </Button>
          )}
          <Button variant="ghost" size="sm" className="px-0 text-gray-500 hover:text-gray-300" onClick={handleIgnore}>
            Ignorar
          </Button>
        </div>
      }
    />
  );
}
