import { Pencil } from "lucide-react";

import Badge from "../atoms/Badge";
import Card from "../atoms/Card";
import IconButton from "../atoms/IconButton";

const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/600x400/1F2937/CBD5E1?text=Sem+Imagem";

/**
 * Molecule: card de produto da listagem de inventário.
 *
 * @param {object} props
 * @param {number} props.quantity Itens de estoque ativos.
 * @param {string} props.name
 * @param {string} [props.type] Rótulo sobreposto à imagem (tipo do produto).
 * @param {string} [props.imageUrl]
 * @param {() => void} props.onClick Abre o estoque do produto.
 * @param {() => void} [props.onEdit] Abre a edição do produto.
 */
export default function ProductCard({
  name,
  quantity,
  type,
  imageUrl,
  onClick,
  onEdit,
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
          alt={name || "Produto"}
          className="h-50 w-full rounded-xl object-cover"
        />
      </figure>

      {onEdit && (
        <IconButton
          onClick={onEdit}
          title={`Editar ${name}`}
          className="absolute top-1 right-1 h-11 w-11 rounded-sm"
        >
          <Pencil className="text-[#48DCFC]" size={18} />
        </IconButton>
      )}

      {type && (
        <Badge
          tone="neutral"
          className="absolute top-0 left-0 rounded-tl-2xl rounded-br-2xl"
        >
          {type}
        </Badge>
      )}

      <div className="flex h-auto flex-col items-center justify-between text-center">
        <h2 className="text-sm font-bold">{name}</h2>

        <div className="badge bg-[#48dbfc1a]">
          <p className="text-[#48DCFC]">Quantidade: {quantity}</p>
        </div>
      </div>
    </Card>
  );
}