import stat from "daisyui/components/stat";
import { useNavigate } from "react-router-dom";
export default function CardProduto(props) {
    const navigate = useNavigate();

    return (
        <div className="card h-65 rounded-2xl bg-[#0A1A3D] w-80 shadow-sm mb-6 hover:cursor-pointer hover:shadow-cyan-300 hover:transition-all transition-all"
            onClick={() => navigate(`/estoque/${props.id}`)}>
            <figure className="w-full h-50">
                <img
                    src="https://tattoounleashed.com/cdn/shop/articles/the-pros-and-cons-of-different-tattoo-machines-198448.jpg?v=1715856207"
                    alt="Shoes"
                    className="rounded-xl w-full h-50 object-cover" />
            </figure>
            <svg className="absolute right-1 top-1 border rounded-sm border-transparent transition-all hover:border-cyan-300" onClick={(e) => {e.stopPropagation();
                                                                                                navigate(`/produtos/editar/${props.id}`);}}
            width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_400_1630)">
                    <rect x="2" y="1" width="40" height="40" rx="8" fill="#263457" shape-rendering="crispEdges" />
                    <path d="M16.1667 26.8333H17.3542L25.5 18.6875L24.3125 17.5L16.1667 25.6458V26.8333ZM14.5 28.5V24.9583L25.5 13.9792C25.6667 13.8264 25.8507 13.7083 26.0521 13.625C26.2535 13.5417 26.4653 13.5 26.6875 13.5C26.9097 13.5 27.125 13.5417 27.3333 13.625C27.5417 13.7083 27.7222 13.8333 27.875 14L29.0208 15.1667C29.1875 15.3194 29.309 15.5 29.3854 15.7083C29.4618 15.9167 29.5 16.125 29.5 16.3333C29.5 16.5556 29.4618 16.7674 29.3854 16.9688C29.309 17.1701 29.1875 17.3542 29.0208 17.5208L18.0417 28.5H14.5ZM27.8333 16.3333L26.6667 15.1667L27.8333 16.3333ZM24.8958 18.1042L24.3125 17.5L25.5 18.6875L24.8958 18.1042Z" fill="#48DCFC" />
                </g>
                <defs>
                    <filter id="filter0_d_400_1630" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                        <feOffset dy="1" />
                        <feGaussianBlur stdDeviation="1" />
                        <feComposite in2="hardAlpha" operator="out" />
                        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_400_1630" />
                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_400_1630" result="shape" />
                    </filter>
                </defs>
            </svg>

            <div className="card-body h-auto flex-col justify-between items-center text-center">
                <h2 className="card-title text-sm">{props.nome}</h2>
                <div className="card-actions justify-end">
                    <div className="badge bg-[#48dbfc1a] ">
                        <p className="text-[#48DCFC]">Quantidade: {props.quantidade}</p> </div>
                </div>
            </div>
        </div>
    )
}