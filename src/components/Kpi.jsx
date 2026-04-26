import "../index.css"

export default function Kpi(props) {

    return (

        <div className="bg-[#132247] h-35 p-4.5 rounded-2xl border border-white/10 text-white font-bold text-xs flex flex-col justify-around font-Roboto">
            <p className="text-cyan-400">{props.titulo}</p>
            <p className="text-3xl font-extrabold">{props.valor}</p>
            <p className="text-gray-500"><span className="text-green-600">{props.descricaoValor}</span> {props.descricaoIndividual}</p>
            <img src={props.icone} alt="icone"  className="w-8 h-8 absolute ml-60 mb-16"/>
        </div>

    )

}