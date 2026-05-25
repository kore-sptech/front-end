import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CadastroProdutoPage from "./CadastroProdutoPage";
import Sidebar from "../../components/Sidebar";
import CardProduto from "../../components/CardProduto";
import SearchBar from "../../components/SearchBar";

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

            // Opcional: mostrar toast se nenhum resultado for encontrado
            if (filtrados.length === 0) {
                toast.info("Nenhum produto encontrado");
            }
        }
    }, [pesquisa, produtos]);

    return (
        <main className="h-screen w-full flex bg-[#000C24] overflow-x-hidden">
            <Sidebar />
            <section className="grow h-full overflow-auto">
                <div className="p-6 flex w-full justify-between">
                    <h1 className="text-3xl font-bold">INVENTÁRIO</h1>
                    <SearchBar
                        value={pesquisa}
                        onChange={setPesquisa}
                    ></SearchBar>
                    <button
                        onClick={() => navigate("cadastro")}
                        className="flex gap-2 px-9 py-2.5 bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] text-[#003640] rounded-xl shadow-xl shadow-cyan-500/20 cursor-pointer font-bold">
                        + Registrar
                    </button>
                </div>
                <div className="p-6 flex w-85 justify-between text-[#dae2ffb4] font-medium text-sm">
                    <button>Todos</button>
                    <button>Tintas e pinturas</button>
                    <button>Agulhas</button>
                </div>
                <div className="p-6 flex w-full h-full justify-between gap-4" id="produtos_listagem">
                    {produtosFiltrados?.map((produto) => {
                        return (
                            <CardProduto
                                key={produto.id}
                                id={produto.id}
                                nome={produto.nome}
                                quantidade={produto.quantidade}
                            />
                        )
                    })}
                </div>
            </section>
        </main>
    )
}