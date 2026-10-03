import { AlertCircle, Calendar, Package } from "lucide-react";

import AlertRow from "./AlertRow";
import Button from "../atoms/Button";

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
 * Molecule: alerta de notificação com ação contextual por severidade.
 *
 * @param {object} props
 * @param {{id: number, tipo: "CRITICO"|"ATENCAO"|"INFORMATIVO", titulo: string,
 *   descricao: string, tempo: string, hasDetails?: boolean}} props.alert
 */
export default function AlertNotification({ alert }) {
  const tone = TONES[alert.tipo] ?? DEFAULT_TONE;

  return (
    <AlertRow
      className={tone.container}
      icon={tone.glyph}
      iconClassName={tone.icon}
      title={alert.titulo}
      description={alert.descricao}
      time={alert.tempo}
      actions={
        alert.tipo === "CRITICO" ? (
          <div className="mt-3 flex gap-4 text-xs font-bold tracking-wider uppercase">
            <Button variant="ghost" size="sm" className="px-0 text-[#22D3EE]">
              Fazer Pedido
            </Button>
            <Button variant="ghost" size="sm" className="px-0 text-gray-500">
              Ignorar
            </Button>
          </div>
        ) : alert.tipo === "INFORMATIVO" && alert.hasDetails ? (
          <div className="mt-3 gap-4 text-xs font-bold tracking-wider uppercase">
            <Button variant="ghost" size="sm" className="px-0 text-[#22D3EE]">
              Ver Detalhes
            </Button>
          </div>
        ) : null
      }
    />
  );
}