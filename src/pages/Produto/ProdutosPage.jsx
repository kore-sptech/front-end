import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import CadastroProdutoPage from "./CadastroProdutoPage";
import Sidebar from "../../components/Sidebar";
import CardProduto from "../../components/CardProduto";
import SearchBar from "../../components/SearchBar";
import { Link } from "react-router-dom";
import "../../index.css";

export default function ProdutoPage() {

    const location = useLocation();

    useEffect(() => {
        if (location.state?.successMessage) {
            toast.success(location.state.successMessage);

            window.history.replaceState({}, document.title);
        }
        if (location.state?.successMessage2) {
            toast.success(location.state.successMessage2);

            window.history.replaceState({}, document.title);
        }
        if (location.state?.successMessage3) {
            toast.success(location.state.successMessage3);

            window.history.replaceState({}, document.title);
        }
    }, []);

    const navigate = useNavigate();

    const [pesquisa, setPesquisa] = useState("")
    const [produtos, setProduto] = useState([])
    const [produtosFiltrados, setProdutosFiltrados] = useState([])
    const [tipo2, setTipo2] = useState("todos");
    useEffect(() => {
        fetch("http://localhost:8080/produtos", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setProduto(data)
                setProdutosFiltrados(data)
                console.log(data)
            })
    }, [])
    useEffect(() => {
        const filtrados = produtos.filter(produto => {
            const nomeOk = produto.nome
                .toLowerCase()
                .includes(pesquisa.toLowerCase());

            const tipoOk =
                tipo2 === "todos" ||
                tipo2 === "" ||
                produto.tipo.toLowerCase().includes(tipo2.toLowerCase());

            return nomeOk && tipoOk;
        });

        setProdutosFiltrados(filtrados);
    }, [pesquisa, tipo2, produtos]);

    function filtrarPor(tipo) {
        setTipo2(tipo);
    }

    console.log(produtos);

    return (
        <main className="h-auto w-full flex bg-[#000C24] overflow-x-hidden">
            <Sidebar />

            <svg className="right-0 top-0 absolute pointer-events-none" width="745" height="721" viewBox="0 0 745 721" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_f_460_506)">
                    <rect x="120" y="68" width="532" height="533" rx="266" fill="#48DCFC" fill-opacity="0.05" />
                </g>
                <defs>
                    <filter id="filter0_f_460_506" x="0" y="-52" width="772" height="773" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur_460_506" />
                    </filter>
                </defs>
            </svg>

            <svg className="bottom-5 left-0 absolute pointer-events-none" width="745" height="721" viewBox="0 0 745 721" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_f_460_506)">
                    <rect x="120" y="68" width="532" height="533" rx="266" fill="#48DCFC" fill-opacity="0.05" />
                </g>
                <defs>
                    <filter id="filter0_f_460_506" x="0" y="-52" width="772" height="773" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                        <feFlood flood-opacity="0" result="BackgroundImageFix" />
                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                        <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur_460_506" />
                    </filter>
                </defs>
            </svg>

            <section className="grow h-full w-full overflow-auto">
                <div className="p-6 flex w-full justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold mr-15 text-[#DAE2FF]">PRODUTOS</h1>

                        <span className="block h-1 w-12 rounded-3xl bg-[#48DCFC]" />
                    </div>
                    <SearchBar
                        value={pesquisa}
                        onChange={setPesquisa}
                    ></SearchBar>
                    <button
                        onClick={() => navigate("cadastro")}
                        className="flex items-center cursor-pointer gap-2 rounded-xl bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] px-6 py-2.5 text-[#003640] shadow-xl shadow-cyan-500/20 font-bold">
                        + Registrar
                    </button>
                </div>


                <div className="ml-5 p-6 flex w-100 justify-between text-[#dae2ffb4] font-medium text-sm">
                    <button
                        onClick={() => filtrarPor("todos")}
                        className={`px-5 py-2 rounded-2xl ${tipo2 === "todos" ? "selecionado" : ""
                            }`}
                    >
                        Todos
                    </button>

                    <button
                        onClick={() => filtrarPor("tintas")}
                        className={`px-5 py-2 rounded-2xl ${tipo2 === "tintas" ? "selecionado" : ""
                            }`}
                    >
                        Tintas
                    </button>

                    <button
                        onClick={() => filtrarPor("agulhas")}
                        className={`px-5 py-2 rounded-2xl ${tipo2 === "agulhas" ? "selecionado" : ""
                            }`}
                    >
                        Agulhas
                    </button>

                    <button
                        onClick={() => filtrarPor("luvas")}
                        className={`px-5 py-2 rounded-2xl ${tipo2 === "luvas" ? "selecionado" : ""
                            }`}
                    >
                        Luvas
                    </button>
                </div>

                <div className="p-6 grid grid-cols-4 gap-y-15 w-full h-full text-center justify-between place-items-center" id="produtos_listagem">

                    {produtosFiltrados.length == 0 && pesquisa.length == 0 && (
                        <div className="col-span-4 text-center mt-25">
                            <h1 className="font-bold text-4xl text-[#DAE2FF]">NENHUM ITEM NO INVENTÁRIO</h1>
                            <p className="text-2xl">Registre seus produtos <button className="underline text-[#48DCFC] cursor-pointer"
                                onClick={() => {
                                    console.log("Enviando:", pesquisa);

                                    navigate("cadastro", {
                                        state: { pesquisa }
                                    });
                                }}
                            >
                                clicando aqui!
                            </button></p>
                        </div>
                    )}

                    {produtosFiltrados.length == 0 && pesquisa.length > 0 && (
                        <div className="col-span-4 text-center mt-25">
                            <h1 className="font-bold text-4xl text-[#DAE2FF]">NENHUM ITEM NO INVENTÁRIO PARA <span className="text-[#48DCFC] font-bold">"{pesquisa}"</span>!</h1>
                            <p className="text-2xl">Registre seus produtos <button className="underline text-[#48DCFC] cursor-pointer"
                                onClick={() => {
                                    console.log("Enviando:", pesquisa);

                                    navigate("cadastro", {
                                        state: { pesquisa }
                                    });
                                }}
                            >
                                clicando aqui!
                            </button></p>
                        </div>
                    )}

                    {produtosFiltrados.length > 0 && (
                        produtosFiltrados.map((produto) => {

                            return (
                                <CardProduto
                                    key={produto.id}
                                    id={produto.id}
                                    nome={produto.nome}
                                    quantidade={produto.qtdMinAlerta}
                                    descricao={produto.descricao}
                                    possuiValidade={produto.possuiValidade}
                                    tipo={produto.tipo}
                                />

                            )
                        })
                    )}

                </div>
            </section>
        </main>
    )
}