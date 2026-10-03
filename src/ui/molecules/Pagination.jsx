import { buildVisiblePages } from "../../utils/pagination";

const BUTTON_BASE =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-xs font-bold tracking-wider transition-all";

/**
 * Molecule: paginação com reticências.
 *
 * @param {object} props
 * @param {number} props.total
 * @param {number} props.current
 * @param {(page: number) => void} props.onChange
 * @param {React.ReactNode} [props.previous] Ícone da página anterior.
 * @param {React.ReactNode} [props.next] Ícone da próxima página.
 */
export default function Pagination({
  total,
  current,
  onChange,
  previous,
  next,
  className = "",
}) {
  if (total <= 1) return null;

  const goTo = (page) => {
    if (page >= 1 && page <= total && page !== current) onChange?.(page);
  };

  return (
    <nav className={`flex items-center gap-1 ${className}`} aria-label="Paginação">
      <button
        type="button"
        onClick={() => goTo(current - 1)}
        disabled={current === 1}
        aria-label="Página anterior"
        className={`${BUTTON_BASE} border border-gray-700 text-gray-400 hover:border-[#22D3EE]/50 hover:text-[#22D3EE] disabled:cursor-not-allowed disabled:opacity-30`}
      >
        {previous}
      </button>

      {buildVisiblePages(total, current).map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="flex h-8 w-8 items-center justify-center text-gray-500"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => goTo(page)}
            aria-current={page === current ? "page" : undefined}
            className={`${BUTTON_BASE} ${
              page === current
                ? "bg-[#22D3EE] text-[#000C24] shadow-[0_0_12px_rgba(34,211,238,0.4)]"
                : "border border-gray-700 text-gray-400 hover:border-[#22D3EE]/50 hover:text-[#22D3EE]"
            }`}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => goTo(current + 1)}
        disabled={current === total}
        aria-label="Próxima página"
        className={`${BUTTON_BASE} border border-gray-700 text-gray-400 hover:border-[#22D3EE]/50 hover:text-[#22D3EE] disabled:cursor-not-allowed disabled:opacity-30`}
      >
        {next}
      </button>
    </nav>
  );
}