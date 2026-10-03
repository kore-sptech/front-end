import { useCallback, useRef, useState } from "react";

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/**
 * Hook: seleção de imagens de referência.
 * Centraliza a leitura via `FileReader` e, opcionalmente, o upload
 * imediato para o servidor (`upload`), devolvendo o id remoto.
 *
 * @param {object} [options]
 * @param {boolean} [options.multiple] Permite várias imagens (padrão: uma).
 * @param {(file: File) => Promise<{data: {id: string|number}}>} [options.upload]
 * @returns {object} Estado e ações do seletor.
 */
export function useImageSelection({ multiple = false, upload } = {}) {
  const [images, setImages] = useState([]);
  const [pendingFile, setPendingFile] = useState(null);
  const [shaking, setShaking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  const openFilePicker = useCallback(() => inputRef.current?.click(), []);

  const handleFiles = useCallback(
    async (event) => {
      const files = Array.from(event.target.files ?? []);
      event.target.value = "";

      if (files.length === 0) return;

      if (!multiple) setPendingFile(files[0]);

      setIsUploading(true);

      try {
        const prepared = await Promise.all(
          files.map(async (file) => {
            const url = await readAsDataUrl(file);

            if (!upload) {
              return { id: `local-${file.name}-${file.size}`, url };
            }

            const { data } = await upload(file);
            return { id: data.id, url };
          }),
        );

        setImages((prev) => (multiple ? [...prev, ...prepared] : prepared.slice(0, 1)));
        setShaking(false);
      } finally {
        setIsUploading(false);
      }
    },
    [multiple, upload],
  );

  const remove = useCallback((id) => {
    setPendingFile(null);
    setImages((prev) => {
      const next = prev.filter((image) => image.id !== id);
      if (next.length === 0) setShaking(true);
      return next;
    });
  }, []);

  const setFromReferences = useCallback((references = []) => {
    setImages(
      references.map((foto) => ({ ...foto, url: foto.imageUrl ?? foto.url })),
    );
    setShaking(references.length === 0);
  }, []);

  const reset = useCallback(() => {
    setImages([]);
    setPendingFile(null);
  }, []);

  const stopShaking = useCallback(() => setShaking(false), []);

  return {
    images,
    pendingFile,
    shaking,
    isUploading,
    isEmpty: images.length === 0,
    inputRef,
    openFilePicker,
    handleFiles,
    remove,
    setFromReferences,
    reset,
    stopShaking,
  };
}