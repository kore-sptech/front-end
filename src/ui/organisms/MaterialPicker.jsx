import { Package, Plus } from "lucide-react";
import { useState } from "react";

import Button from "../atoms/Button";
import Spinner from "../atoms/Spinner";
import CheckboxRow from "../molecules/CheckboxRow";
import EmptyState from "../molecules/EmptyState";
import Modal from "../molecules/Modal";
import SearchInput from "../molecules/SearchInput";
import { useMaterialOptions } from "../../features/scheduling/useMaterialOptions";
import { formatCurrency, formatDate } from "../../utils/formatters";

/**
 * Organism: seleção de materiais de um agendamento em dois passos
 * (produto → itens de estoque).
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {(material: {produtoId: number|string, nome: string, itens: object[]}) => void} props.onSelect
 */
export default function MaterialPicker({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return <MaterialPickerContent onClose={onClose} onSelect={onSelect} />;
}

/**
 * @param {object} props
 * @param {() => void} props.onClose
 * @param {(material: {produtoId: number|string, nome: string, itens: object[]}) => void} props.onSelect
 */
function MaterialPickerContent({ onClose, onSelect }) {
  const [step, setStep] = useState("products");
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const { products, items, isLoading, selectProduct } = useMaterialOptions();

  const openItems = (product) => {
    setSelectedProduct(product);
    setSelectedItemIds([]);
    setStep("items");
    selectProduct(product);
  };

  const toggleItem = (itemId) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const confirm = () => {
    onSelect({
      produtoId: selectedProduct.id,
      nome: selectedProduct.nome,
      itens: items.filter((item) => selectedItemIds.includes(item.id)),
    });

    onClose();
  };

  const filteredProducts = products.filter((product) =>
    product.nome.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const activeItems = items.filter((item) => item.seAtivo !== false);

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="lg"
      title={
        step === "products"
          ? "Estoque de Materiais"
          : `Itens de ${selectedProduct?.nome ?? ""}`
      }
      description={
        step === "products"
          ? "Escolha o produto que deseja utilizar na sessão"
          : "Selecione os itens que deseja adicionar ao agendamento"
      }
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" className="text-cyan-400" />
        </div>
      ) : step === "products" ? (
        <>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Buscar produto..."
            className="mb-4"
          />

          <div className="custom-scrollbar max-h-[55vh] space-y-2 overflow-y-auto pr-2">
            {filteredProducts.length === 0 ? (
              <EmptyState
                title="Nenhum produto"
                description="Nenhum produto disponível no momento."
              />
            ) : (
              filteredProducts.map((product) => (
                <Button
                  key={product.id}
                  variant="subtle"
                  className="h-auto w-full justify-between px-4 py-3"
                  onClick={() => openItems(product)}
                >
                  <span className="flex items-center gap-3">
                    <Package size={18} className="text-cyan-400" />
                    <span className="text-left font-semibold">{product.nome}</span>
                  </span>
                  <Plus size={16} />
                </Button>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div className="custom-scrollbar max-h-[55vh] space-y-3 overflow-y-auto pr-2">
            {activeItems.length === 0 ? (
              <EmptyState
                title="Estoque vazio"
                description="Nenhum item disponível para este produto."
              />
            ) : (
              activeItems.map((item) => (
                <CheckboxRow
                  key={item.id}
                  isSelected={selectedItemIds.includes(item.id)}
                  onToggle={() => toggleItem(item.id)}
                  title={item.nome || selectedProduct.nome}
                  details={
                    <>
                      <span>{formatCurrency(item.valorUnitario)}</span>
                      {item.dataValidade && (
                        <span>Validade: {formatDate(item.dataValidade)}</span>
                      )}
                    </>
                  }
                />
              ))
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="neutral"
              onClick={() => setStep("products")}
              className="flex-1 tracking-widest uppercase"
            >
              Voltar
            </Button>
            <Button
              onClick={confirm}
              disabled={selectedItemIds.length === 0}
              className="flex-1 tracking-widest uppercase"
            >
              Salvar ({selectedItemIds.length})
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
}