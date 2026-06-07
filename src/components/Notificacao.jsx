export default function Notificacao(props) {
    const Icone = props.icone;

    return (
        <div className="w-20/21 pt-5 pb-5 mb-3 flex bg-[#021134] rounded-2xl p-5 m-0">
            <Icone className="w-15 h-15 mr-12 text-green-400" />

            <div className="flex flex-col justify-around gap-2">
                <h2>{props.titulo}</h2>
                <p className="text-[9px] text-gray-400">{props.descricao}</p>
                <p className="text-[9px] text-blue-500">{props.tempo}</p>
            </div>
        </div>
    );
}