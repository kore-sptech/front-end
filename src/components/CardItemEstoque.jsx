import { api } from "../utils/api";
import { handleApiError } from "../utils/errorHandler";
import { useNavigate } from "react-router-dom";
export default function CardItemEstoque(props) {
  const navigate = useNavigate();
  const imagemPadrao =
    "https://via.placeholder.com/600x400/1F2937/CBD5E1?text=Sem+Imagem";
  const imagemProduto = props.imagem || imagemPadrao;
  async function deletar() {
    try {
      const { status } = await api.delete(`/estoque/${props.id}`);
      if (status === 204) {
        //document.getElementById('modal_sucesso').showModal();                    atualizarLista={carregarEstoque} foi adicionado para atualizar a lista de produtos após a exclusão
        props.atualizarLista();
      } else {
        handleApiError(
          new Error("Exclusão sem confirmação do servidor."),
          "Não foi possível excluir o item.",
        );
      }
    } catch (err) {
      handleApiError(err, "Não foi possível excluir o item.");
    }
  }
  return (
    <div
      className="card relative h-65 w-full max-w-80 rounded-2xl bg-[#0A1A3D] shadow-sm transition-all hover:cursor-pointer hover:shadow-cyan-300 hover:transition-all"
      onClick={() => navigate(`/estoque/${props.id}`)}
    >
      <figure className="h-50 w-full">
        <img
          src={imagemProduto}
          alt={props.nome || "Produto"}
          className="h-50 w-full rounded-xl object-cover"
        />
      </figure>
      <svg
        className="absolute top-1 right-1 cursor-pointer rounded-sm border border-transparent transition-all hover:border-cyan-300"
        onClick={(e) => {
          e.stopPropagation();
          deletar();
        }}
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_d_400_1630)">
          <rect
            x="2"
            y="1"
            width="40"
            height="40"
            rx="8"
            fill="#263457"
            shapeRendering="crispEdges"
          />

          {/* Linhas cruzadas formando o 'X' */}
          <rect
            x="10"
            y="19"
            width="24"
            height="4"
            fill="#48DCFC"
            transform="rotate(45, 22, 21)"
          />
          <rect
            x="10"
            y="19"
            width="24"
            height="4"
            fill="#48DCFC"
            transform="rotate(-45, 22, 21)"
          />
        </g>
        <defs>
          {/* Atributos convertidos para camelCase (colorInterpolationFilters, floodOpacity, etc) */}
          <filter
            id="filter0_d_400_1630"
            x="0"
            y="0"
            width="44"
            height="44"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_400_1630"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_400_1630"
              result="shape"
            />
          </filter>
        </defs>
      </svg>

      <div className="card-body h-auto flex-col items-center justify-between text-center">
        <h2 className="card-title text-sm">{props.dataValidade}</h2>
        <div className="card-actions justify-end">
          {props.valorUnitario && (
            <div className="badge bg-[#48dbfc1a]">
              <p className="text-[#48DCFC]">Preço: R$ {props.valorUnitario}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
