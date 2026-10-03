import { useCallback, useEffect, useState } from "react";

import {
  buildProductPayload,
  validateProduct,
} from "./productValidation";
import {
  atualizarProduto,
  criarProduto,
  enviarImagemProduto,
  excluirProduto,
} from "../../services/produtos";
import { useImageSelection } from "../../hooks/useImageSelection";
import { handleApiError } from "../../utils/errorHandler";

const toText = (value) => (value != null ? String(value) : "");

const EMPTY_FORM = {
  name: "",
  description: "",
  hasExpiry: false,
  minAlertQuantity: "0",
  categoryId: null,
  type: "",
};

/**
 * Hook: estado e regras do formulário de produto (criar e editar).
 *
 * @param {object} [options]
 * @param {object|null} [options.produto] Produto em edição (null = criação).
 * @param {boolean} [options.isOpen]
 * @param {string} [options.initialName] Nome pré-preenchido (busca da listagem).
 * @param {string} [options.usuarioId]
 * @param {() => void} [options.onSaved] Navegação após salvar.
 * @param {() => void} [options.onRemoved] Navegação após excluir.
 * @returns {object} API consumida pelo organismo `ProductForm`.
 */
export function useProductForm({
  produto = null,
  isOpen = true,
  initialName = "",
  usuarioId,
  onSaved,
  onRemoved,
} = {}) {
  const isEditing = Boolean(produto?.id);

  const [values, setValues] = useState(() => ({
    name: produto?.nome ?? initialName,
    description: produto?.descricao ?? EMPTY_FORM.description,
    hasExpiry: produto?.possuiValidade ?? EMPTY_FORM.hasExpiry,
    minAlertQuantity: toText(
      produto?.qtdMinAlerta ?? produto?.quantidadeMinimaAlerta ?? 0,
    ),
    categoryId:
      produto?.categoria?.id ?? produto?.categoriaId ?? produto?.fk_categoria ?? null,
    type: produto?.tipo ?? EMPTY_FORM.type,
  }));
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    images,
    isEmpty: hasNoImage,
    pendingFile,
    shaking: imagesShaking,
    inputRef: imagesInputRef,
    openFilePicker: openImagesPicker,
    handleFiles: handleImageFiles,
    remove: removeImage,
    setFromReferences,
    stopShaking: stopImagesShaking,
  } = useImageSelection();

  const change = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateProduct({ ...values, [name]: value })[name],
    }));
  }, [values]);

  useEffect(() => {
    if (!isOpen) return;

    setFromReferences(produto?.imagemKey ? [{ id: "atual", imageUrl: produto.imagemKey }] : []);
    stopImagesShaking();
  }, [isOpen, produto, setFromReferences, stopImagesShaking]);

  const submit = useCallback(async () => {
    const validationErrors = validateProduct(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return false;

    setIsSaving(true);

    const payload = buildProductPayload(values, usuarioId);

    try {
      if (isEditing) {
        await atualizarProduto(usuarioId, produto.id, payload);

        if (pendingFile) {
          await enviarImagemProduto(produto.id, pendingFile);
        }
      } else {
        const { data } = await criarProduto(usuarioId, payload);

        if (pendingFile && data?.id) {
          await enviarImagemProduto(data.id, pendingFile);
        }
      }

      onSaved?.();
      return true;
    } catch (error) {
      handleApiError(
        error,
        isEditing
          ? "Não foi possível alterar o produto."
          : "Não foi possível cadastrar o produto.",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [isEditing, onSaved, pendingFile, produto, usuarioId, values]);

  const remove = useCallback(async () => {
    setIsDeleting(true);

    try {
      const { status } = await excluirProduto(usuarioId, produto.id);

      if (status !== 204) {
        throw new Error("Exclusão sem confirmação do servidor.");
      }

      onRemoved?.();
      return true;
    } catch (error) {
      handleApiError(error, "Não foi possível excluir o produto.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [onRemoved, produto, usuarioId]);

  return {
    isEditing,
    values,
    errors,
    change,
    submit,
    remove,
    isSaving,
    isDeleting,
    images,
    hasNoImage,
    pendingFile,
    imagesShaking,
    imagesInputRef,
    openImagesPicker,
    handleImageFiles,
    removeImage,
  };
}