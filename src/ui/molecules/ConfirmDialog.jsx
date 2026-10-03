import Button from "../atoms/Button";
import Modal from "./Modal";

/**
 * Molecule: diálogo de confirmação (substitui os `<dialog>` imperativos).
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} props.title
 * @param {React.ReactNode} [props.description]
 * @param {string} [props.warning] Destaque de irreversibilidade.
 * @param {string} [props.confirmLabel]
 * @param {string} [props.cancelLabel]
 * @param {() => void} [props.onConfirm]
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  title,
  description,
  warning = "Essa ação é permanente e não pode ser desfeita.",
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmVariant = "primary",
  onConfirm,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      {description && (
        <p className="text-sm font-light text-gray-200">{description}</p>
      )}

      {warning && (
        <p className="mt-3 text-sm font-light text-gray-200">
          <span className="font-bold text-[#48DCFC]">Atenção:</span> {warning}
        </p>
      )}

      <div className="mt-7 flex justify-end gap-4">
        <Button variant="outline" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}