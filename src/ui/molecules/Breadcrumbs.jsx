import { Link } from "react-router-dom";

/**
 * Molecule: trilha de navegação (breadcrumbs).
 *
 * O separador é desenhado pelo próprio daisyUI (`li + li`). O último item
 * representa a página atual e é renderizado como texto com `aria-current`;
 * os demais viram link quando recebem `to`.
 *
 * @param {object} props
 * @param {Array<{label: string, to?: string}>} props.items
 * @param {string} [props.className]
 * @param {string} [props.ariaLabel] Rótulo acessível da trilha.
 */
export default function Breadcrumbs({
  items = [],
  className = "",
  ariaLabel = "Trilha de navegação",
}) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className={`breadcrumbs text-sm text-[#BBC9CD] ${className}`}
    >
      <ul>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`}>
              {item.to && !isCurrent ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className={isCurrent ? "font-medium text-[#DAE2FF]" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
