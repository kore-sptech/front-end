export default function ItemCritico(props){

    return (
        <div className="w-4/5 bg-[#b2000c2c] p-3 pt-2 pb-2 rounded-r-lg border-l-2 border-red-400 mb-5">

            <h2>{props.titulo}</h2><br />
            <p className="text-[9px] text-gray-500">{props.descricao}</p>

        </div>
    )

}