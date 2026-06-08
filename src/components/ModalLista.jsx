import { X } from "lucide-react";

export default function ModalLista({
  isOpen,
  onClose,
  title = "Selecione uma opção",
  items = [],
  ItemComponent,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-800 bg-[#061639] p-6 shadow-2xl">
        
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-600 transition-colors hover:text-white"
        >
          <X size={22} />
        </button>

        {/* Cabeçalho */}
        <div className="mb-6">
          <h2 className="text-center text-xl font-bold text-cyan-400">
            {title}
          </h2>
        </div>

        {/* Container da Lista com Scroll */}
        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
          {items.length > 0 ? (
            items.map((item, index) => (
              <ItemComponent key={item.id || index} item={item} />
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-[#BBC9CD]">
                Nenhum item disponível no momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}