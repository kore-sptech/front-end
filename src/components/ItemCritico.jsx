export default function ItemCritico(props){

    return (
        <div className="w-full bg-[#021134] p-3 pt-2 pb-2 rounded-lg border-l-3 border-red-400 mb-3">

            <h2>{props.titulo}</h2><br />
            <p className="text-[9px] text-gray-400">{props.descricao}</p>

        </div>
    )

}