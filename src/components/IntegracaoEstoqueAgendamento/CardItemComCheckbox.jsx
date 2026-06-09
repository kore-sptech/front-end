import { Check } from "lucide-react";

export default function CardItemComCheckbox({
  id,
  produtoNome,
  valorUnitario,
  dataValidade,
  isSelected,
  onToggle,
}) {
  const formatarData = (data) => {
    if (!data) return "N/A";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <div
      onClick={onToggle}
      className="flex items-center gap-4 rounded-2xl border border-gray-700/50 bg-[#0A1A3D] p-4 transition-all hover:border-cyan-400/30 hover:bg-[#0f2352] hover:cursor-pointer"
    >
      {/* Checkbox */}
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
          isSelected
            ? "border-cyan-400 bg-cyan-400"
            : "border-gray-600 bg-transparent"
        }`}
      >
        {isSelected && <Check size={16} className="text-black" />}
      </div>

      {/* Informações do Item */}
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-gray-200">{produtoNome}</h3>
        <div className="mt-1 flex gap-4 text-xs text-gray-400">
          <span>
            Valor: <span className="text-cyan-400 font-medium">R$ {valorUnitario?.toFixed(2)}</span>
          </span>
          <span>
            Validade: <span className="text-cyan-400 font-medium">{formatarData(dataValidade)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
