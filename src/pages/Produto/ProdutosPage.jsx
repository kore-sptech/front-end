import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CadastroProdutoPage from "./CadastroProdutoPage";
import Sidebar from "../../components/Sidebar";
import CardProduto from "../../components/CardProduto";
import SearchBar from "../../components/SearchBar";
import { Link } from "react-router-dom";
import "../../index.css";

export default function ProdutoPage() {
    const produtosMocados = [
        {
            id: 1,
            nome: "Monitor Gamer 24'",
            descricao: "Monitor 144hz Full HD",
            possuiValidade: false,
            qtdMinAlerta: 5,
            quantidade: 12,
            tipo: "agulha"
        },
        {
            id: 2,
            nome: "Teclado Mecânico RGB",
            descricao: "Switch Blue, Layout ABNT2",
            possuiValidade: false,
            qtdMinAlerta: 10,
            quantidade: 8,
            tipo: "agulha"
        },
        {
            id: 3,
            nome: "Cabo HDMI 2.0",
            descricao: "Cabo de 2 metros reforçado",
            possuiValidade: false,
            qtdMinAlerta: 20,
            quantidade: 45,
            tipo: "tinta"
        },
        {
            id: 4,
            nome: "Pasta Térmica Silver",
            descricao: "Seringa de 5g",
            possuiValidade: true,
            qtdMinAlerta: 2,
            quantidade: 3,
            tipo: "pintura"
        },
        {
            id: 5,
            nome: "Pasta Térmica Silver",
            descricao: "Seringa de 5g",
            possuiValidade: true,
            qtdMinAlerta: 2,
            quantidade: 3,
            tipo: "pintura"
        }
    ];
    const navigate = useNavigate();

    const [pesquisa, setPesquisa] = useState("")
    const [produtos, setProduto] = useState(produtosMocados)
    const [produtosFiltrados, setProdutosFiltrados] = useState(produtosMocados)
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

        if (!pesquisa.trim()) {
            // Se pesquisa estiver vazia, mostra todos os produtos
            setProdutosFiltrados(produtos);
        } else {
            // Filtra produtos baseado no nome (case insensitive)
            const filtrados = produtos.filter(produto =>
                produto.nome.toLowerCase().includes(pesquisa.toLowerCase())
            );
            setProdutosFiltrados(filtrados);
        }
    }, [pesquisa, produtos]);

    function filtrarPor(tipo) {

        if (tipo == "todos") {

            const button = document.getElementById("todos");
            button.classList.add("selecionado")
            const button2 = document.getElementById("tintas/pinturas");
            button2.classList.remove("selecionado")
            const button3 = document.getElementById("agulhas");
            button3.classList.remove("selecionado")

            const filtrados2 = produtos;
            setProdutosFiltrados(filtrados2);
            return;
        }
        if (tipo == "tintas/pintura") {

            const button = document.getElementById("tintas/pinturas");
            button.classList.add("selecionado")
            const button2 = document.getElementById("todos");
            button2.classList.remove("selecionado")
            const button3 = document.getElementById("agulhas");
            button3.classList.remove("selecionado")

            const filtrados2 = produtos.filter(produto => {
                const tipoProduto = produto.tipo.toLowerCase();
                // Verifica se inclui "tinta" OU se inclui "pintura"
                return tipoProduto.includes("tinta") || tipoProduto.includes("pintura");
            });
            setProdutosFiltrados(filtrados2);
            return;
        }
        if (tipo == "agulha") {

            const button = document.getElementById("agulhas");
            button.classList.add("selecionado")
            const button2 = document.getElementById("todos");
            button2.classList.remove("selecionado")
            const button3 = document.getElementById("tintas/pinturas");
            button3.classList.remove("selecionado")

            const filtrados2 = produtos.filter(produto =>
                produto.tipo.toLowerCase().includes(tipo.toLowerCase())
            );
            setProdutosFiltrados(filtrados2);
            return;
        }

    }

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
                    <h1 className="text-4xl font-bold mr-15 text-[#DAE2FF]">INVENTÁRIO</h1>
                    <SearchBar
                        value={pesquisa}
                        onChange={setPesquisa}
                    ></SearchBar>
                    <button
                        onClick={() => navigate("cadastro")}
                        className="flex cursor-pointer gap-2 rounded-xl bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] px-6 py-2.5 text-[#003640] shadow-xl shadow-cyan-500/20 font-bold">
                        + Registrar
                    </button>
                </div>


                <div className="ml-5 p-6 flex w-100 justify-between text-[#dae2ffb4] font-medium text-sm">
                    <button id="todos" onClick={() => filtrarPor("todos")} className="selecionado px-5 py-2 rounded-2xl hover:cursor-pointer hover:text-[#48DCFC] hover:transition-colors transition-colors">Todos</button>
                    <button id="tintas/pinturas" onClick={() => filtrarPor("tintas/pintura")} className="px-5 py-2 rounded-2xl hover:cursor-pointer hover:text-[#48DCFC] hover:transition-colors transition-colors">Tintas e pinturas</button>
                    <button id="agulhas" onClick={() => filtrarPor("agulha")} className="px-5 py-2 rounded-2xl hover:cursor-pointer hover:text-[#48DCFC] hover:transition-colors transition-colors">Agulhas</button>
                </div>

                <div className="p-6 grid grid-cols-4 w-full h-full text-center justify-between" id="produtos_listagem">

                    {produtosFiltrados.length == 0 && pesquisa.length == 0 && (
                        <div className="col-span-4 text-center mt-25">
                            <h1 className="font-bold text-2xl text-[#DAE2FF]">NENHUM ITEM NO INVENTÁRIO</h1>
                            <p className="">Regriste seus produtos <Link className="underline text-[#48DCFC]" onClick={() => navigate("cadastro")}>clicando aqui!</Link></p>
                        </div>
                    )}

                    {produtosFiltrados.length == 0 && pesquisa.length > 0 && (
                        <div className="col-span-4 text-center mt-25">
                            <h1 className="font-bold text-3xl text-[#DAE2FF]">NENHUM ITEM NO INVENTÁRIO PARA <span className="text-[#48DCFC] font-bold">"{pesquisa}"</span>!</h1>
                            <p className="text-2xl">Regriste seus produtos <Link className="underline text-[#48DCFC]" onClick={() => navigate("cadastro")}>clicando aqui!</Link></p>
                        </div>
                    )}

                    {produtosFiltrados.length > 0 && (
                        produtosFiltrados.map((produto) => {
                            return (
                                <CardProduto
                                    key={produto.id}
                                    id={produto.id}
                                    nome={produto.nome}
                                    quantidade={produto.quantidade}
                                />
                            )
                        })
                    )}

                </div>
            </section>
        </main>
    )
}