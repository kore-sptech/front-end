import { ChevronRight } from "lucide-react";

/**
 * Molecule: trilha de navegação (breadcrumbs).
 *
 * @param {object} props
 * @param {Array<{label: string, onClick?: () => void}>} props.items
 */
export default function Breadcrumbs({ items = [], className = "" }) {
  return (
    <nav aria-label="Trilha de navegação" className={`breadcrumbs text-sm ${className}`}>
      <ul>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label}>
              {item.onClick && !isLast ? (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="cursor-pointer"
                >
                  {item.label}
                </button>
              ) : (
                <u className="flex items-center gap-1">
                  {index > 0 && <ChevronRight size={12} aria-hidden="true" />}
                  {item.label}
                </u>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}