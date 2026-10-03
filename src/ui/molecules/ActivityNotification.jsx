import AlertRow from "./AlertRow";

const ICON_TONES = {
  Entrada: "text-green-400",
  Agendamento: "text-[#48DCFC]",
  Saida: "text-orange-400",
  Lembrete: "text-gray-400",
};

/**
 * Molecule: notificação de atividade (usada no feed do dashboard).
 *
 * @param {object} props
 * @param {React.ComponentType} props.icon Componente de ícone (lucide).
 * @param {"Entrada"|"Agendamento"|"Saida"|"Lembrete"} props.tipo
 */
export default function ActivityNotification({
  icon: Icon,
  tipo,
  title,
  description,
  time,
}) {
  return (
    <AlertRow
      className="mb-3 w-20/21 rounded-2xl border border-l-5 bg-[#021134] p-5"
      icon={Icon ? <Icon className={`h-12 w-12 ${ICON_TONES[tipo] ?? ""}`} /> : null}
      iconClassName=""
      title={title}
      description={description}
      time={time}
    />
  );
}