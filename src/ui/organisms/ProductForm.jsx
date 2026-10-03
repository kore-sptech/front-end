import { useState } from "react";

import Button from "../atoms/Button";
import ConfirmDialog from "../molecules/ConfirmDialog";
import Control from "../atoms/Control";
import Field from "../atoms/Field";
import ImageUploader from "../molecules/ImageUploader";
import Panel from "../molecules/Panel";
import CategorySelector from "./CategorySelector";
import { PRODUCT_LIMITS } from "../../features/products/productValidation";
import { useProductForm } from "../../features/products/useProductForm";

/**
 * Organism: formulário de produto (cadastro e edição).
 *
 * @param {object} props
 * @param {object|null} [props.produto] Produto em edição (null = cadastro).
 * @param {string} props.usuarioId
 * @param {() => void} [props.onSaved] Navegação após salvar.
 * @param {() => void} [props.onRemoved] Navegação após excluir.
 * @param {() => void} [props.onCancel]
 * @param {string} [props.initialName] Nome pré-preenchido (busca da listagem).
 */
export default function ProductForm({
  produto = null,
  usuarioId,
  onSaved,
  onRemoved,
  onCancel,
  initialName = "",
}) {
  const form = useProductForm({
    produto,
    usuarioId,
    initialName,
    onSaved,
    onRemoved,
  });
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isEditing = Boolean(produto?.id);

  const submit = async (event) => {
    event.preventDefault();
    await form.submit();
  };

  const confirmDelete = async () => {
    const deleted = await form.remove();

    if (deleted) setIsDeleteOpen(false);
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-nowrap items-start justify-center gap-5"
    >
      <Panel className="max-w-2xl grow text-[#BBC9CD]" bodyClassName="flex flex-col">
        <Field
          label="Nome do produto"
          hint={`${form.values.name.length}/${PRODUCT_LIMITS.NAME_MAX} (mín. ${PRODUCT_LIMITS.NAME_MIN})`}
          error={form.errors.name}
        >
          <Control
            type="text"
            value={form.values.name}
            invalid={Boolean(form.errors.name)}
            onChange={(event) => form.change("name", event.target.value)}
          />
        </Field>

        <Field
          className="mt-4"
          label="Descrição"
          hint={`${form.values.description.length}/${PRODUCT_LIMITS.DESCRIPTION_MAX}`}
          error={form.errors.description}
        >
          <Control
            as="textarea"
            value={form.values.description}
            invalid={Boolean(form.errors.description)}
            onChange={(event) => form.change("description", event.target.value)}
          />
        </Field>

        <div className="mt-4 mb-2 flex justify-between gap-4">
          <Field
            className="flex-1"
            label="Possui validade?"
            error={form.errors.hasExpiry}
          >
            <Control
              as="select"
              value={String(form.values.hasExpiry)}
              onChange={(event) =>
                form.change("hasExpiry", event.target.value === "true")
              }
            >
              <option value="false">Não</option>
              <option value="true">Sim</option>
            </Control>
          </Field>

          <Field
            className="flex-1"
            label="Quantidade mínima"
            error={form.errors.minAlertQuantity}
          >
            <Control
              type="number"
              min="0"
              value={form.values.minAlertQuantity}
              invalid={Boolean(form.errors.minAlertQuantity)}
              onChange={(event) =>
                form.change("minAlertQuantity", event.target.value)
              }
            />
          </Field>
        </div>

        <div className="mt-4 flex flex-col gap-5">
          <span className="text-xs font-bold tracking-widest text-[#BBC9CD] uppercase">
            Categoria
          </span>

          <CategorySelector
            value={form.values.categoryId}
            onChange={(categoryId) => form.change("categoryId", categoryId)}
            usuarioId={usuarioId}
          />

          {form.errors.categoryId && (
            <p role="alert" className="text-[11px] text-red-400">
              {form.errors.categoryId}
            </p>
          )}
        </div>
      </Panel>

      <Panel className="w-full max-w-xs grow" bodyClassName="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <span className="mb-2 block text-xs font-bold tracking-widest text-[#BBC9CD] uppercase">
            Referência Visual
          </span>

          <ImageUploader
            images={form.images}
            onAdd={form.openImagesPicker}
            onRemove={form.removeImage}
            addSize="md"
            className="[&_button]:h-48 [&_button]:w-48"
            inputProps={{
              ref: form.imagesInputRef,
              onChange: form.handleImageFiles,
            }}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          fullWidth
          className="min-w-55 whitespace-nowrap"
          loading={form.isSaving}
          loadingLabel="Salvando..."
        >
          {isEditing ? "Salvar alterações" : "Registrar"}
        </Button>

        <Button
          variant="neutral"
          size="lg"
          fullWidth
          className="min-w-55 whitespace-nowrap"
          onClick={onCancel}
        >
          Cancelar
        </Button>

        {isEditing && (
          <Button
            variant="outline"
            size="lg"
            fullWidth
            className="min-w-55 whitespace-nowrap"
            onClick={() => setIsDeleteOpen(true)}
          >
            Deletar
          </Button>
        )}
      </Panel>

      {isEditing && (
        <ConfirmDialog
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          title="Excluir Produto"
          description="Tem certeza de que deseja excluir este produto?"
          confirmLabel="Excluir"
          confirmVariant="danger"
          onConfirm={confirmDelete}
        />
      )}
    </form>
  );
}