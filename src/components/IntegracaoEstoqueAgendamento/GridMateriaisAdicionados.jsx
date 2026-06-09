import { Trash2 } from "lucide-react";

export default function GridMateriaisAdicionados({
  materiais,
  onRemover,
}) {
  if (materiais.length === 0) return null;

  const calcularValorTotal = (itens) => {
    return itens.reduce((sum, item) => sum + (item.valorUnitario || 0), 0);
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-800 bg-[#263457]/20 p-4">
      <h3 className="mb-4 text-sm font-bold tracking-widest text-gray-400 uppercase">
        Materiais Adicionados
      </h3>

      <div className="space-y-3">
        {materiais.map((material, index) => {
          const valorTotal = calcularValorTotal(material.itens);
          
          return (
            <div
              key={index}
              className="flex items-center gap-4 rounded-lg border border-gray-700/50 bg-[#0A1A3D] p-4 transition-all"
            >
              {/* Produto e Itens */}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-cyan-400">
                  {material.produtoNome}
                </h4>
                <p className="mt-1 text-xs text-gray-400">
                  {material.itens.length} item{material.itens.length > 1 ? "ns" : ""} selecionado
                  {material.itens.length > 1 ? "s" : ""}
                </p>
              </div>

              {/* Valor Total */}
              <div className="text-right">
                <p className="text-xs text-gray-400">Valor Total</p>
                <p className="text-sm font-bold text-cyan-400">
                  R$ {valorTotal.toFixed(2)}
                </p>
              </div>

              {/* Botão Remover */}
              <button
                type="button"
                onClick={() => onRemover(index)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 transition-all hover:border-red-500/60 hover:bg-red-500/20"
              >
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
