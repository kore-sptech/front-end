import "../index.css";

export default function Kpi(props) {
  return (
    <div className="font-Roboto relative flex h-35 flex-col justify-around rounded-2xl border border-white/10 bg-[#132247] p-4.5 text-xs font-bold text-white">
      <p className="text-cyan-400">{props.titulo}</p>
      <p className="text-3xl font-extrabold">{props.valor}</p>
      <p className="text-gray-500">
        <span className="text-green-600">{props.descricaoValor}</span>{" "}
        {props.descricaoIndividual}
      </p>
      <img
        src={props.icone}
        alt="icone"
        className="absolute mb-16 ml-[80%] h-8 w-8"
      />
    </div>
  );
}
