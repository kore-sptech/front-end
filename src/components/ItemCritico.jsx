import { AlertTriangle } from "lucide-react";

export default function ItemCritico(props){

    return (
        <div className="w-full bg-[#5a1212bd] p-3 pt-2 pb-2 rounded-lg border-l-4 border border-red-400 mb-3 flex items-center">
            <AlertTriangle className="text-red-400 mr-4 p-2 w-10 h-10 bg-red-500/10 rounded-lg"/>
            <div>
                <h2 className="mb-2">{props.titulo}</h2>
                <p className="text-[9px] text-gray-400">{props.descricao}</p>
            </div>
        </div>
    )

}