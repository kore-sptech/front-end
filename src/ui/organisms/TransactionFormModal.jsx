import { useState } from "react";
import { toast } from "sonner";

import Button from "../atoms/Button";
import Control from "../atoms/Control";
import Field from "../atoms/Field";
import Modal from "../molecules/Modal";
import MoneyInput from "../atoms/MoneyInput";
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
  buildTransactionPayload,
  hasTransactionChanged,
  validateTransaction,
} from "../../features/transactions/transactionForm";
import { useTransactionSubmission } from "../../features/transactions/useTransactionActions";
import { formatCurrency } from "../../utils/formatters";

const DEFAULT_VALUES = {
  name: "",
  type: "ENTRADA",
  category: "MATERIAS",
  value: 0,
};

const fromTransaction = (transaction) => ({
  name: transaction.nome,
  type: transaction.tipo,
  category: transaction.categoria,
  value: Number(transaction.valor),
});

const centsToAmount = (text) => {
  const digits = text.replace(/\D/g, "");

  return digits ? (Number(digits) / 100).toFixed(2) : "";
};

/**
 * Organism: formulário de transação (criar e editar).
 *
 * O formulário interno é remontado por `key` a cada abertura, então os valores
 * saem do estado inicial em vez de serem sincronizados por efeito.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {object|null} [props.transaction] Transação em edição.
 * @param {() => void} props.onSaved
 */
export default function TransactionFormModal({
  isOpen,
  onClose,
  transaction = null,
  onSaved,
}) {
  if (!isOpen) return null;

  return (
    <TransactionForm
      key={transaction?.id ?? "new"}
      onClose={onClose}
      transaction={transaction}
      onSaved={onSaved}
    />
  );
}

/**
 * @param {object} props
 * @param {() => void} props.onClose
 * @param {object|null} props.transaction
 * @param {() => void} props.onSaved
 */
function TransactionForm({ onClose, transaction = null, onSaved }) {
  const [values, setValues] = useState(() =>
    transaction ? fromTransaction(transaction) : DEFAULT_VALUES,
  );
  const [errors, setErrors] = useState({});
  const { isSaving, save } = useTransactionSubmission({ transaction, onSaved });

  const isEditing = Boolean(transaction?.id);

  const change = (name, value) => {
    const next = { ...values, [name]: value };

    setValues(next);

    setErrors((prev) => ({
      ...prev,
      [name]: validateTransaction(next)[name],
    }));
  };

  const changeMoney = (text) => {
    const amount = centsToAmount(text);

    change("value", amount ? Number(amount) : 0);
  };

  const submit = async (event) => {
    event.preventDefault();

    const validationErrors = validateTransaction(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    if (isEditing && !hasTransactionChanged(values, transaction)) {
      onClose();
      return;
    }

    const saved = await save(buildTransactionPayload(values));

    if (saved) {
      toast.success(
        isEditing
          ? "Transação atualizada com sucesso!"
          : "Transação adicionada com sucesso!",
      );

      onClose();
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isEditing ? "Editar Transação" : "Nova Transação"}
      footer={
        <>
          <Button variant="neutral" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="transaction-form"
            loading={isSaving}
            loadingLabel="Salvando..."
          >
            {isEditing ? "Salvar" : "Adicionar Transação"}
          </Button>
        </>
      }
    >
      <form id="transaction-form" onSubmit={submit} className="space-y-4">
        <Field label="Descrição" error={errors.name}>
          <Control
            type="text"
            placeholder="Ex: Tatuagem Realista"
            value={values.name}
            invalid={Boolean(errors.name)}
            onChange={(event) => change("name", event.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Valor (R$)"
            hint={values.value > 0 && formatCurrency(values.value)}
            error={errors.value}
          >
            <MoneyInput
              value={values.value > 0 ? formatCurrency(values.value) : ""}
              invalid={Boolean(errors.value)}
              onChange={(event) => changeMoney(event.target.value)}
            />
          </Field>

          <Field label="Tipo" error={errors.type}>
            <Control
              as="select"
              value={values.type}
              invalid={Boolean(errors.type)}
              onChange={(event) => change("type", event.target.value)}
            >
              {TRANSACTION_TYPES.filter((type) => type.value).map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Control>
          </Field>
        </div>

        {values.type === "SAIDA" && (
          <Field label="Categoria">
            <Control
              as="select"
              value={values.category}
              onChange={(event) => change("category", event.target.value)}
            >
              {TRANSACTION_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Control>
          </Field>
        )}
      </form>
    </Modal>
  );
}