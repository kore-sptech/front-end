import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AsideBar from "../../components/AsideBar";
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

    const [dataValidade, setDataValidade] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [valor, setValor] = useState('');
    return (
        <main className="h-screen w-full flex bg-[#000C24] overflow-hidden">
            <AsideBar></AsideBar>
            <section className="flex-grow h-full overflow-auto">
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

                    <fieldset className="fieldset bg-[#0A1A3D] border-base-300 rounded-box flex-grow max-w-2xl border p-6">
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
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
                                />
                            </div>
                        </div>
                    </fieldset>
                </div>
            </section>
        </main>

    )

}