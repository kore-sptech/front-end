import Card from "../atoms/Card";
import IconButton from "../atoms/IconButton";
import { X } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/600x400/1F2937/CBD5E1?text=Sem+Imagem";

/**
 * Molecule: card de item de estoque (lote com validade e valor unitário).
 *
 * @param {object} props
 * @param {string|number} props.id
 * @param {string} [props.expiryDate] Validade já formatada ("12/06/2026").
 * @param {number} [props.unitPrice]
 * @param {string} [props.imageUrl]
 * @param {() => void} props.onClick
 * @param {() => void} [props.onDelete]
 */
export default function StockItemCard({
  id,
  expiryDate,
  unitPrice,
  imageUrl,
  onClick,
  onDelete,
}) {
  return (
    <Card
      variant="raised"
      interactive
      onClick={onClick}
      className="h-65 w-full max-w-80"
    >
      <figure className="h-50 w-full">
        <img
          src={imageUrl || PLACEHOLDER_IMAGE}
          alt={`Item de estoque ${id}`}
          className="h-50 w-full rounded-xl object-cover"
        />
      </figure>

      {onDelete && (
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
          title={`Excluir item ${id}`}
          className="absolute top-1 right-1 h-11 w-11 rounded-sm"
        >
          <X className="rounded bg-[#0A1A3D] p-1 text-[#48DCFC]" size={24} />
        </IconButton>
      )}

      <div className="flex h-auto flex-col items-center justify-between text-center">
        <h2 className="text-sm font-bold">{expiryDate || "Sem validade"}</h2>

        {unitPrice ? (
          <div className="badge bg-[#48dbfc1a]">
            <p className="text-[#48DCFC]">Preço: {formatCurrency(unitPrice)}</p>
          </div>
        ) : (
          <div />
        )}
      </div>
    </Card>
  );
}
