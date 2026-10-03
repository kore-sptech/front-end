import { X } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import IconButton from "../atoms/IconButton";

const WIDTHS = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-[720px]",
  xxl: "max-w-[960px]",
};

const Z_INDEX = {
  sm: "z-100",
  md: "z-110",
  lg: "z-120",
};

/**
 * Molecule: modal declarativo (overlay + caixa + título + slot de ações).
 * Substitui os `<dialog>` controlados por `document.getElementById`.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.description] Subtítulo do cabeçalho.
 * @param {"sm"|"md"|"lg"} [props.size] Largura máxima da caixa.
 * @param {React.ReactNode} [props.footer] Ações do rodapé.
 * @param {boolean} [props.dismissible] Fecha ao clicar no overlay (padrão: true).
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "sm",
  footer,
  dismissible = true,
  className = "",
  children,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 ${Z_INDEX[size] ?? Z_INDEX.sm} flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm`}
      onClick={dismissible ? onClose : undefined}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        onClick={(event) => event.stopPropagation()}
        className={`relative w-full ${WIDTHS[size] ?? WIDTHS.sm} rounded-2xl border border-gray-800 bg-[#061639] p-8 shadow-2xl ${className}`}
      >
        <IconButton
          onClick={onClose}
          title="Fechar"
          size="sm"
          className="absolute top-4 right-4 text-gray-600 hover:text-white"
        >
          <X size={22} />
        </IconButton>

        <div className="mb-6">
          <h2 className="text-center text-2xl font-bold text-cyan-400">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-center text-sm text-[#BBC9CD]">
              {description}
            </p>
          )}
        </div>

        {children}

        {footer && <div className="mt-6 flex gap-3">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}