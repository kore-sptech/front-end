import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CadastroProdutoPage from "./CadastroProdutoPage";
import AsideBar from "../../components/AsideBar";
import CardProduto from "../../components/CardProduto";
import SearchBar from "../../components/SearchBar";

export default function ProdutoPage(){
    const navigate = useNavigate();

    const[pesquisa, setPesquisa] = useState("")
    const[produtos, setProduto] = useState([])
    useEffect(() => {
        fetch("http://localhost:8080/produtos",{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response)=>{response.json()})
        .then((data) => setProduto(data))
        console.log(data)
    }, [])

    return(
        <main className="h-screen w-full flex bg-[#000C24] overflow-hidden">
            <AsideBar></AsideBar>
            <section className="flex-grow h-full overflow-auto">
                <div className="p-6 flex w-full justify-between">
                    <h1 className="text-4xl font-bold">INVENTÁRIO</h1>
                    <SearchBar></SearchBar>
                    <button
                        onClick={() => navigate("cadastro")} 
                        className="flex gap-2 px-6 py-2.5 bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] text-[#003640] rounded-xl shadow-xl shadow-cyan-500/20 cursor-pointer">
                    + Registrar
                    </button>
                </div>
                <div className="p-6 flex-wrap w-full justify-between">
                    {produtos?.map((produto) => {
                        return(
                            <CardProduto 
                                key={produto.id}
                                name={produto.nome}
                                quantidade={produto.quantidade}
                                />
                            )
                    })}
                </div>
            </section>
        </main>
    )
}