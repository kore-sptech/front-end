import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DEFAULT_DURATION_MIN,
  SESSION_DURATIONS_MIN,
  addMinutesToLocalInput,
  formatDuration,
  fromApiDateTime,
} from "./sessionFormatters";
import {
  associarItemEstoque,
  listarEstoqueDoAgendamento,
} from "../../services/estoque";
import {
  atualizarAgendamento,
  buscarProximoDisponivel,
  criarAgendamento,
} from "../../services/agendamentos";
import { enviarFoto } from "../../services/fotos";
import { flattenMaterialItemIds, groupStockByProduct } from "./materials";
import { isSessionValid, validateSession } from "./sessionValidation";
import { handleApiError } from "../../utils/errorHandler";
import { useImageSelection } from "../../hooks/useImageSelection";

const EMPTY_FIELDS = {
  cliente: "",
  preco: "",
  telefone: "",
  pagamento: "",
  de: "",
  ate: "",
};

const toText = (value) => (value != null ? String(value) : "");

/**
 * Constrói o estado inicial do formulário a partir de um agendamento.
 *
 * @param {object|null} session Agendamento existente.
 * @returns {{fields: object, durationMinutes: number}}
 */
function buildInitialState(session) {
  const de = fromApiDateTime(session?.inicio);
  const ate = fromApiDateTime(session?.fim);

  let durationMinutes = DEFAULT_DURATION_MIN;

  if (de && ate) {
    const diff = Math.round((new Date(ate).getTime() - new Date(de).getTime()) / 60_000);
    if (diff > 0) durationMinutes = diff;
  }

  return {
    fields: session
      ? {
          cliente: toText(session.cliente),
          preco: session.preco != null ? String(session.preco) : "",
          telefone: toText(session.telefone),
          pagamento: toText(session.formaPagamento),
          de,
          ate,
        }
      : EMPTY_FIELDS,
    durationMinutes,
  };
}

/**
 * Hook: estado e regras do formulário de agendamento (criar/editar).
 *
 * @param {object} [options]
 * @param {object|null} [options.session] Agendamento em edição (null = novo).
 * @param {boolean} [options.isOpen]
 * @param {() => void} [options.onSaved] Disparado após criar/atualizar.
 * @returns {object} API consumida pelo organismo `SessionModal`.
 */
export function useSessionForm({ session = null, isOpen = false, onSaved } = {}) {
  const isEditing = Boolean(session?.id);

  const initial = useMemo(() => buildInitialState(session), [session]);

  const [fields, setFields] = useState(initial.fields);
  const [durationMinutes, setDurationMinutes] = useState(initial.durationMinutes);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [materials, setMaterials] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const {
    images,
    isEmpty: hasNoImage,
    shaking: imagesShaking,
    isUploading: isUploadingImages,
    inputRef: imagesInputRef,
    openFilePicker: openImagesPicker,
    handleFiles: handleImageFiles,
    remove: removeImage,
    setFromReferences,
    stopShaking: stopImagesShaking,
  } = useImageSelection({ multiple: true, upload: enviarFoto });

  const canSubmit = isSessionValid(fields, durationMinutes) && !hasNoImage;

  /**
   * Atualiza o erro de campos específicos seminvalidar os demais.
   */
  const syncErrors = useCallback((keys, nextFields, nextDuration) => {
    const allErrors = validateSession(nextFields, nextDuration);

    setErrors((prev) => {
      const next = { ...prev };
      keys.forEach((key) => {
        next[key] = allErrors[key];
      });
      return next;
    });
  }, []);

  const loadMaterials = useCallback(async (sessionId) => {
    try {
      const { data } = await listarEstoqueDoAgendamento(sessionId);
      return data?.length ? groupStockByProduct(data) : [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    let cancelled = false;

    async function prepare() {
      const nextFields = { ...initial.fields };

      if (!isEditing) {
        try {
          const { data } = await buscarProximoDisponivel();
          const suggestion = data?.inicio ? data.inicio.slice(0, 16) : "";

          if (suggestion) {
            nextFields.de = suggestion;
            nextFields.ate = addMinutesToLocalInput(
              suggestion,
              initial.durationMinutes,
            );
          }
        } catch (error) {
          handleApiError(
            error,
            "Não foi possível buscar o próximo horário disponível.",
          );
        }
      }

      const nextMaterials = isEditing ? await loadMaterials(session.id) : [];

      if (cancelled) return;

      setFields(nextFields);
      setDurationMinutes(initial.durationMinutes);
      setErrors({});
      setTouched({});
      setMaterials(nextMaterials);
      setFromReferences(session?.referencias ?? []);
      stopImagesShaking();
    }

    void prepare();

    return () => {
      cancelled = true;
    };
  }, [
    initial,
    isEditing,
    isOpen,
    loadMaterials,
    session,
    setFromReferences,
    stopImagesShaking,
  ]);

  const change = useCallback(
    (name, value) => {
      setFields((prev) => {
        const next = { ...prev, [name]: value };

        if (name === "de") {
          next.ate = addMinutesToLocalInput(value, durationMinutes);
        }

        if (touched[name]) syncErrors([name], next, durationMinutes);

        return next;
      });
    },
    [durationMinutes, syncErrors, touched],
  );

  const blur = useCallback(
    (name) => {
      setTouched((prev) => ({ ...prev, [name]: true }));
      syncErrors([name], fields, durationMinutes);
    },
    [durationMinutes, fields, syncErrors],
  );

  const changeDuration = useCallback(
    (minutes) => {
      setDurationMinutes(minutes);

      setFields((prev) => {
        const next = { ...prev, ate: addMinutesToLocalInput(prev.de, minutes) };

        if (touched.ate) syncErrors(["ate"], next, minutes);

        return next;
      });
    },
    [syncErrors, touched.ate],
  );

  const buildPayload = useCallback(
    () => ({
      cliente: fields.cliente,
      preco: parseFloat(fields.preco),
      telefone: fields.telefone,
      formaPagamento: fields.pagamento,
      inicio: fields.de,
      fim: addMinutesToLocalInput(fields.de, durationMinutes),
      referencias: images.map((image) => image.id),
      materiais: materials.map((material) => ({
        produtoId: material.produtoId,
        itens: material.itens.map((item) => item.id),
      })),
    }),
    [durationMinutes, fields, images, materials],
  );

  const submit = useCallback(async () => {
    const allKeys = Object.keys(fields);
    setTouched(allKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    const validationErrors = validateSession(fields, durationMinutes);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return false;

    if (hasNoImage) {
      stopImagesShaking();
      return false;
    }

    setIsSaving(true);

    const payload = buildPayload();

    try {
      if (isEditing) {
        await atualizarAgendamento(session.id, payload);
        await Promise.all(
          flattenMaterialItemIds(materials).map((itemId) =>
            associarItemEstoque(itemId, session.id),
          ),
        );
      } else {
        await criarAgendamento(payload);
      }

      onSaved?.();
      return true;
    } catch (error) {
      handleApiError(
        error,
        isEditing
          ? "Não foi possível atualizar o agendamento."
          : "Não foi possível adicionar o agendamento.",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [
    buildPayload,
    durationMinutes,
    fields,
    hasNoImage,
    isEditing,
    materials,
    onSaved,
    session,
    stopImagesShaking,
  ]);

  const addMaterial = useCallback((material) => {
    setMaterials((prev) => {
      const withoutProduct = prev.filter(
        (item) => item.produtoId !== material.produtoId,
      );

      return [...withoutProduct, material];
    });
  }, []);

  const removeMaterial = useCallback((productId) => {
    setMaterials((prev) => prev.filter((item) => item.produtoId !== productId));
  }, []);

  return {
    isEditing,
    fields,
    errors,
    durationMinutes,
    durationOptions: SESSION_DURATIONS_MIN.map((minutes) => ({
      value: minutes,
      label: formatDuration(minutes),
    })),
    materials,
    canSubmit,
    isSaving,
    isUploadingImages,
    images,
    hasNoImage,
    imagesShaking,
    imagesInputRef,
    openImagesPicker,
    handleImageFiles,
    removeImage,
    change,
    blur,
    changeDuration,
    addMaterial,
    removeMaterial,
    submit,
  };
}