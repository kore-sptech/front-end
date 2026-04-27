import { useNavigate } from "react-router-dom";
export default function CardProduto(props){
    const navigate = useNavigate();

    return(
        <div className="card bg-[#0A1A3D] w-96 shadow-sm " 
            onClick={() => navigate("editar")}>
            <figure className="px-10 pt-10">
                <img
                src="https://tattoounleashed.com/cdn/shop/articles/the-pros-and-cons-of-different-tattoo-machines-198448.jpg?v=1715856207"
                alt="Shoes"
                className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">{props.nome}</h2>
                 <div className="card-actions justify-end">
                    <div className="badge bg-[#48dbfc1a] ">
                        <p className="text-[#48DCFC]">Quantidade: {props.quantidade}</p> </div>
                    </div>
            </div>
        </div>
    )
}