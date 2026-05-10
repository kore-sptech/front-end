import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AsideBar from "../../components/AsideBar";
import SearchBar from "../../components/SearchBar";
export default function EstoquePage() {
    const location = useLocation();
    const { id } = useParams();
    const [estoque, setEstoque] = useState(null);

    useEffect(() => {
        console.log(id)
        fetch(`http://localhost:8080/estoque/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                setEstoque(data);
            })
    }
        , [id])
    return (
        <main className="h-screen w-full flex bg-[#000C24] overflow-hidden">
            <AsideBar></AsideBar>
            <section className="flex-grow h-full overflow-auto">
                <div className="p-6 flex w-full justify-between">
                    <h1 className="text-4xl font-bold">INVENTÁRIO</h1>
                    <SearchBar

                    ></SearchBar>
                    <button
                        onClick={() => navigate("cadastro")}
                        className="flex gap-2 px-6 py-2.5 bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] text-[#003640] rounded-xl shadow-xl shadow-cyan-500/20 cursor-pointer">
                        + Registrar
                    </button>
                </div>
                <div className="p-6 flex w-full justify-between gap-4" id="produtos_listagem">
                    {estoque?.map((estoque) => {
                        return (
                        <h1>{estoque.nome}</h1>
                        )
                    })
                    }
                </div>
            </section>

        </main>
    )
}