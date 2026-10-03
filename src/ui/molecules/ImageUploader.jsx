import { Plus, X } from "lucide-react";

import IconButton from "../atoms/IconButton";

const THUMB =
  "group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-700/50";

/**
 * Molecule: seletor de imagens com pré-visualização, adição e remoção.
 * O input de arquivo e a leitura em `FileReader` ficam em
 * `hooks/useImageSelection.js`.
 *
 * @param {object} props
 * @param {Array<{id: string|number, url: string}>} props.images
 * @param {() => void} props.onAdd Abre o seletor de arquivos.
 * @param {(id: string|number) => void} props.onRemove
 * @param {boolean} [props.invalid] Estado de erro do campo.
 * @param {boolean} [props.shaking] Dispara a animação de "shake".
 * @param {() => void} [props.onAnimationEnd] Notifica o fim da animação de "shake".
 * @param {React.ReactNode} [props.footer] Mensagem auxiliar abaixo da grade.
 * @param {React.ReactNode} [props.emptyError] Mensagem de erro exibida abaixo.
 * @param {object} [props.inputProps] Props repassadas ao `<input type="file">`.
 */
export default function ImageUploader({
  images = [],
  onAdd,
  onRemove,
  invalid = false,
  shaking = false,
  onAnimationEnd,
  footer,
  emptyError,
  inputProps = {},
  addSize = "sm",
  className = "",
}) {
  return (
    <div className={className}>
      <div
        onAnimationEnd={onAnimationEnd}
        className={`rounded-2xl border p-4 transition-all duration-200 ${shaking ? "shake" : ""} ${
          invalid
            ? "border-red-500/50 bg-red-500/5"
            : "border-[#3C494D]/10 bg-[#263457]/20"
        }`}
      >
        <div className="flex flex-wrap gap-3">
          {images.map((image) => (
            <div key={image.id} className={THUMB}>
              <img
                src={image.url}
                alt="Referência"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove?.(image.id)}
                aria-label="Remover imagem"
                className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          ))}

          <IconButton
            variant="solid"
            size={addSize}
            title="Adicionar imagem"
            onClick={onAdd}
            className={`h-24 w-24 flex-col gap-1 ${invalid ? "border-red-500/30 bg-red-500/10" : ""}`}
          >
            <Plus
              size={20}
              className={invalid ? "text-red-400" : "text-gray-500"}
            />
            <span
              className={`text-[10px] ${invalid ? "text-red-400" : "text-gray-600"}`}
            >
              Adicionar
            </span>
          </IconButton>
        </div>

        {footer && (
          <p className="mt-3 text-[11px] text-cyan-400/40">{footer}</p>
        )}
      </div>

      {emptyError && (
        <p role="alert" className="mt-1.5 text-[11px] text-red-400">
          {emptyError}
        </p>
      )}

      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        {...inputProps}
      />
    </div>
  );
}
