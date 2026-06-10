import { X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import CardItemComCheckbox from "./CardItemComCheckbox";
import { api } from "../../utils/api";
import toast from "react-hot-toast";

export default function ModalItensDosProdutos({
  isOpen,
  onClose,
  produtoId,
  produtoNome,
  onSalvar,
}) {
  if (!isOpen) return null;

  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Fetch items quando a modal abre
  useEffect(() => {
    if (isOpen && produtoId) {
      fetchItens();
    }
  }, [isOpen, produtoId]);

  const fetchItens = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/estoque/${produtoId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setItens(data || []);
      setSelectedItems([]);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      toast.error("Erro ao carregar itens do produto.");
      setItens([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleItem = (itemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleSalvar = () => {
    if (selectedItems.length === 0) {
      toast.error("Selecione ao menos um item.");
      return;
    }

    // Passa os itens selecionados para o parent
    const itensParaSalvar = itens.filter((item) =>
      selectedItems.includes(item.id)
    );

    onSalvar({
      produtoId,
      produtoNome,
      itens: itensParaSalvar,
    });

    // Fecha a modal
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-800 bg-[#061639] p-8 shadow-2xl">
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-gray-600 transition-colors hover:text-white"
        >
          <X size={22} />
        </button>

        {/* Cabeçalho */}
        <div className="mb-7">
          <h2 className="mb-1 text-center text-2xl font-bold text-cyan-400">
            Itens de {produtoNome}
          </h2>
          <p className="text-center text-sm text-[#BBC9CD]">
            Selecione os itens que deseja adicionar ao agendamento
          </p>
        </div>

        {/* Container da Lista com Scroll */}
        <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={32} className="animate-spin text-cyan-400" />
            </div>
          ) : itens.length > 0 ? (
            itens.filter(item => item.seAtivo === true).map((item) => (
              <CardItemComCheckbox
                key={item.id}
                id={item.id}
                produtoNome={produtoNome}
                valorUnitario={item.valorUnitario}
                dataValidade={item.dataValidade}
                isSelected={selectedItems.includes(item.id)}
                onToggle={() => handleToggleItem(item.id)}
              />
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-[#BBC9CD]">
                Nenhum item disponível para este produto.
              </p>
            </div>
          )}
        </div>

        {/* Rodapé com Botões */}
        {itens.length > 0 && (
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-600 py-3 text-sm font-bold tracking-widest text-gray-400 uppercase transition-all hover:border-gray-400 hover:text-gray-300"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSalvar}
              disabled={selectedItems.length === 0}
              className={`flex-1 rounded-lg py-3 text-sm font-bold tracking-widest uppercase transition-all ${
                selectedItems.length > 0
                  ? "cursor-pointer bg-cyan-400 text-black shadow-lg shadow-cyan-400/20 hover:bg-cyan-300"
                  : "cursor-not-allowed bg-gray-800 text-gray-600 opacity-60"
              }`}
            >
              Salvar ({selectedItems.length})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
