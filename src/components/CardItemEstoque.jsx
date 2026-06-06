import stat from "daisyui/components/stat";
import { useNavigate } from "react-router-dom";
export default function CardProduto(props) {
    const navigate = useNavigate();
    async function deletar(){
        await fetch(`http://localhost:8080/estoque/${props.id}`,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            if(response.status === 204){
                //document.getElementById('modal_sucesso').showModal();                    atualizarLista={carregarEstoque} foi adicionado para atualizar a lista de produtos após a exclusão
                props.atualizarLista();
            }else{
                console.log(response.status)
            }})
    }
    return (
        <div className="card h-65 rounded-2xl bg-[#0A1A3D] w-80 shadow-sm mb-6 hover:cursor-pointer hover:shadow-cyan-300 hover:transition-all transition-all"
            onClick={() => navigate(`/estoque/${props.id}`)}>
            <figure className="w-full h-50">
                <img
                    src="https://tattoounleashed.com/cdn/shop/articles/the-pros-and-cons-of-different-tattoo-machines-198448.jpg?v=1715856207"
                    alt="Shoes"
                    className="rounded-xl w-full h-50 object-cover" />
            </figure>
            <svg 
            className="absolute right-1 top-1 border rounded-sm border-transparent transition-all hover:border-cyan-300 cursor-pointer" 
            onClick={(e) => {e.stopPropagation();
            deletar();
            }}
            width="44" 
            height="44" 
            viewBox="0 0 44 44" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            <g filter="url(#filter0_d_400_1630)">
                <rect x="2" y="1" width="40" height="40" rx="8" fill="#263457" shapeRendering="crispEdges" />
                
                {/* Linhas cruzadas formando o 'X' */}
                <rect x="10" y="19" width="24" height="4" fill="#48DCFC" transform="rotate(45, 22, 21)" />
                <rect x="10" y="19" width="24" height="4" fill="#48DCFC" transform="rotate(-45, 22, 21)" />
            </g>
            <defs>
                {/* Atributos convertidos para camelCase (colorInterpolationFilters, floodOpacity, etc) */}
                <filter id="filter0_d_400_1630" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
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
                <h2 className="card-title text-sm">{props.dataValidade}</h2>
                <div className="card-actions justify-end">
                    <div className="badge bg-[#48dbfc1a] ">
                        <p className="text-[#48DCFC]">Quantidade:</p> </div>
                </div>
            </div>
        </div>
    )
}