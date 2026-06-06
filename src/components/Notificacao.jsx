export default function Notificacao(props){

    return (
        <div className="w-20/21 pt-5 pb-5 mb-5 flex bg-[#1A294C] rounded-2xl p-5 m-0">
            <img src={props.icone} alt="Icone Notificação" className="w-15 h-15 mr-12"/>
            
            <div className="flex flex-col justify-around gap-2">
                <h2>{props.titulo}</h2>
                <p className="text-[9px] text-gray-500">{props.descricao}</p>
                <p className="text-[9px] text-blue-500">{props.tempo}</p>
            </div>
        </div>
    )

}