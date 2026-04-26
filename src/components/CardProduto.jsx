import { useNavigate } from "react-router-dom";
export default function CardProduto(props){
    const navigate = useNavigate();

    return(
        <div className="card bg-[#0A1A3D] w-96 shadow-sm " 
            onClick={() => navigate("editar")}>
            <figure className="px-10 pt-10">
                <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes"
                className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">{props.nome}</h2>
                 <div className="card-actions justify-end">
                    <div className="badge badge-outline">CAT:</div>
                    <div className="badge badge-primary">Quantidade: {props.quantidade} </div>
                    
                </div>
            </div>
        </div>
    )
}