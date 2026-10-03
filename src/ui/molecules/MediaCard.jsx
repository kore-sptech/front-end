import Badge from "../atoms/Badge";
import Card from "../atoms/Card";
import IconButton from "../atoms/IconButton";

/**
 * Molecule: card de mídia (imagem + selo + título + rodapé + ação opcional).
 *
 * @param {object} props
 * @param {string} props.imageSrc
 * @param {string} props.imageAlt
 * @param {React.ReactNode} props.title
 * @param {React.ReactNode} [props.badge] Selo sobreposto à imagem.
 * @param {React.ReactNode} [props.footer] Área inferior do card.
 * @param {() => void} [props.onActionClick] Habilita o botão de ação.
 * @param {string} [props.actionLabel] Rótulo acessível do botão de ação.
 */
export default function MediaCard({
  imageSrc,
  imageAlt,
  title,
  badge,
  footer,
  onActionClick,
  actionLabel,
  actionIcon,
  onClick,
  className = "",
  bodyClassName = "",
}) {
  return (
    <Card
      variant="raised"
      interactive={Boolean(onClick)}
      onClick={onClick}
      className={`h-65 w-full max-w-80 ${className}`}
    >
      <figure className="h-50 w-full">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-50 w-full rounded-xl object-cover"
        />
      </figure>

      {actionIcon && (
        <IconButton
          onClick={onActionClick}
          title={actionLabel}
          className="absolute top-1 right-1 h-11 w-11 rounded-sm"
        >
          {actionIcon}
        </IconButton>
      )}

      {badge && (
        <Badge
          tone="neutral"
          className="absolute top-0 left-0 rounded-tl-2xl rounded-br-2xl"
        >
          {badge}
        </Badge>
      )}

      <div
        className={`flex h-auto flex-col items-center justify-between text-center ${bodyClassName}`}
      >
        <h2 className="text-sm font-bold">{title}</h2>
        {footer}
      </div>
    </Card>
  );
}