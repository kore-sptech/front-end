import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import CardProduto from "../../components/CardProduto";
import SearchBar from "../../components/SearchBar";
import {
    AlertCircle,
    ArrowRight,
    ImageOff,
    Phone,
    Plus,
    X,
} from "lucide-react";


export default function AdicionarEstoquePage() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [dataValidade, setDataValidade] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [valorUnitario, setValorUnitario] = useState('');
    const [seAtivo, setSeAtivo] = useState(true);
    async function cadastrar() {
        const agora = new Date();
        const dataEntradaFormatada = new Date(agora.getTime() - (agora.getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 19);
        const dataValidadeFormatada = dataValidade ? `${dataValidade}T00:00:00` : null;

        const estoque = {
            valorUnitario: parseFloat(valorUnitario),
            dataValidade: dataValidadeFormatada,
            dataEntrada: dataEntradaFormatada,
            seAtivo: seAtivo
        };
        await fetch(`http://localhost:8080/estoque/${quantidade}/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(estoque)
        }).then((response) => {
            if (response.status === 201) {
                //document.getElementById('modal_sucesso').showModal();
            } else {
                console.log(response.status)
            }
        })
    }
    return (
        <main className="h-screen w-full flex bg-[#000C24] overflow-hidden">
            <Sidebar></Sidebar>
            <section className="grow h-full overflow-auto">
                <div className="p-6 flex w-full justify-between">
                    <div className="breadcrumbs text-sm">
                        <ul>
                            <li><a>INVENTÁRIO</a></li>
                            <li><a>ESTOQUE</a></li>
                            <li><a>ADICIONAR ESTOQUE</a></li>
                        </ul>
                    </div>
                </div>
                <div className="p-6 flex-wrap w-full justify-between">
                    <h1 className="text-4xl font-bold">ADICIONAR ESTOQUE</h1>
                </div>
                <div className="p-6 flex w-full justify-between items-end gap-8">

                    <fieldset className="fieldset bg-[#0A1A3D] border-base-300 rounded-box grow max-w-2xl border p-6">
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className={`flex-1 transition-opacity`}>
                                <label className="label text-xs font-bold opacity-70">QUANTIDADE</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="input bg-[#0A1A3D] w-full border-gray-600 focus:border-[#48DCFC]"
                                    value={quantidade}
                                    onChange={(e) => setQuantidade(e.target.value)}
                                />


                            </div>
                        </div>


                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <label className="label text-xs font-bold opacity-70">DATA DE VALIDADE</label>
                                <input
                                    type="date"
                                    className="input bg-[#0A1A3D] w-full border-gray-600 focus:border-[#48DCFC]"
                                    value={dataValidade}
                                    onChange={(e) => setDataValidade(e.target.value)}
                                />
                            </div>

                            <div className="flex-1">
                                <label className="label text-xs font-bold opacity-70">VALOR (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    placeholder="0,00"
                                    className="input bg-[#0A1A3D] w-full border-gray-600 focus:border-[#48DCFC]"
                                    value={valorUnitario}
                                    onChange={(e) => setValorUnitario(e.target.value)}
                                />
                            </div>

                        </div>
                        <div className="flex flex-col md:flex-row gap-12 justify-between w-full mt-8">
                            <button
                                onClick={cadastrar}
                                className="flex justify-center items-center gap-2 px-10 py-4 text-lg font-bold bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] text-[#003640] rounded-xl shadow-xl shadow-cyan-500/30 cursor-pointer transition-transform hover:scale-105 active:scale-95 min-w-55"
                            >
                                Alterar
                            </button>
                            <button
                                onClick={() => navigate(`/estoque/${id}`)}
                                className="flex justify-center items-center gap-2 px-10 py-4 text-lg font-bold bg-transparent text-gray-400 border border-gray-600 rounded-xl cursor-pointer hover:bg-gray-800 transition-all min-w-55"
                            >
                                Cancelar
                            </button>
                        </div>

                    </fieldset>
                </div>
            </section>
        </main>

    )

}