import Button from "../atoms/Button";
import Control from "../atoms/Control";
import Field from "../atoms/Field";
import Modal from "../molecules/Modal";
import MoneyInput from "../atoms/MoneyInput";
import { formatCurrency } from "../../utils/formatters";
import { useStockEntry } from "../../features/inventory/useStockEntry";

/**
 * Organism: modal de entrada de estoque em um produto.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string|number} props.productId
 * @param {string} [props.productName] Exibido no título.
 * @param {() => void} props.onSaved
 */
export default function StockEntryModal({
  isOpen,
  onClose,
  productId,
  productName = "",
  onSaved,
}) {
  const form = useStockEntry({
    productId,
    onSaved: () => {
      onSaved?.();
      onClose();
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    await form.submit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={productName ? `Adicionar Estoque — ${productName}` : "Adicionar Estoque"}
      footer={
        <>
          <Button variant="neutral" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="stock-entry-form"
            disabled={!form.isValid}
            loading={form.isSaving}
            loadingLabel="Salvando..."
          >
            Adicionar
          </Button>
        </>
      }
    >
      <form id="stock-entry-form" onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Quantidade" error={form.errors.quantity}>
          <Control
            type="number"
            min="1"
            placeholder="Ex: 10"
            value={form.values.quantity}
            invalid={Boolean(form.errors.quantity)}
            onChange={(event) => form.change("quantity", event.target.value)}
          />
        </Field>

        <Field label="Data de validade">
          <Control
            type="date"
            value={form.values.expiryDate}
            onChange={(event) => form.change("expiryDate", event.target.value)}
          />
        </Field>

        <Field
          label="Valor unitário"
          hint={form.values.unitPrice && formatCurrency(form.values.unitPrice)}
          error={form.errors.unitPrice}
        >
          <MoneyInput
            value={
              form.values.unitPrice
                ? formatCurrency(form.values.unitPrice)
                : ""
            }
            invalid={Boolean(form.errors.unitPrice)}
            onChange={(event) => {
              const digits = event.target.value.replace(/\D/g, "");

              form.change("unitPrice", digits ? (Number(digits) / 100).toFixed(2) : "");
            }}
          />
        </Field>
      </form>
    </Modal>
  );
}