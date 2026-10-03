import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../ui/atoms/Button";
import ConfirmDialog from "../../ui/molecules/ConfirmDialog";
import EmptyState from "../../ui/molecules/EmptyState";
import PageHeader from "../../ui/molecules/PageHeader";
import SearchInput from "../../ui/molecules/SearchInput";
import StockItemCard from "../../ui/molecules/StockItemCard";
import { useState } from "react";
import { useStockItems } from "../../features/inventory/useStockItems";

/**
 * Page: itens de estoque de um produto.
 *
 * @returns {React.ReactElement}
 */
export default function InventoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { items, productImage, search, setSearch, remove } = useStockItems({
    productId: id,
  });

  const [pendingDelete, setPendingDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const requestDelete = (item) => {
    setPendingDelete(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    const item = pendingDelete;

    setIsDeleteOpen(false);
    setPendingDelete(null);
    await remove(item.id);
  };

  return (
    <main className="h-full w-full overflow-y-auto bg-[#000C24] text-[#DAE2FF]">
      <PageHeader
        title="ESTOQUE"
        className="p-4 sm:p-6"
        actions={
          <>
            <SearchInput
              className="max-w-sm"
              value={search}
              onChange={setSearch}
              placeholder="Buscar item..."
            />

            <Button onClick={() => navigate("adicionar")}>+ Registrar</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 justify-items-center gap-6 px-4 pb-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 xl:grid-cols-4">
        {items.length === 0 ? (
          <EmptyState
            title="NENHUM ITEM NO ESTOQUE!"
            description="Cadastre um item para começar a controlar este produto."
            action={{
              label: "Registrar item",
              onClick: () => navigate("adicionar"),
            }}
          />
        ) : (
          items.map((item) => (
            <StockItemCard
              key={item.id}
              id={item.id}
              expiryDate={
                item.dataValidade
                  ? new Date(item.dataValidade).toLocaleDateString("pt-BR")
                  : "Sem validade"
              }
              unitPrice={item.valorUnitario}
              imageUrl={productImage}
              onDelete={() => requestDelete(item)}
            />
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setPendingDelete(null);
        }}
        title="Excluir item"
        description="Tem certeza de que deseja excluir este item de estoque?"
        confirmLabel="Excluir"
        confirmVariant="danger"
        onConfirm={confirmDelete}
      />
    </main>
  );
}