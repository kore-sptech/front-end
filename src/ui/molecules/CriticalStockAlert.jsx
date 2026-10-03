import { AlertTriangle } from "lucide-react";

/**
 * Molecule: item de estoque em nível crítico (dashboard).
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} props.description
 */
export default function CriticalStockAlert({ title, description }) {
  return (
    <div className="mb-3 flex w-full items-center rounded-lg border border-l-4 border-red-400 bg-[#5a1212bd] p-3 pt-2 pb-2">
      <AlertTriangle className="mr-4 h-10 w-10 rounded-lg bg-red-500/10 p-2 text-red-400" />
      <div>
        <h3 className="mb-2">{title}</h3>
        <p className="text-[9px] text-gray-400">{description}</p>
      </div>
    </div>
  );
}