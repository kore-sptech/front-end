import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import SearchBar from "../../components/SearchBar";
import CardItemEstoque from "../../components/CardItemEstoque";

export default function EstoquePage() {
    const location = useLocation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [estoque, setEstoque] = useState(null);

    const carregarEstoque = async () => {
        try {
            const response = await fetch(`http://localhost:8080/estoque/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json();
            setEstoque(data);
        } catch (error) {
            console.error("Erro ao carregar estoque:", error);
        }
    };
    useEffect(() => {
        if (id) {
            carregarEstoque();
        }
    }, [id]);

    return (
        <main className="h-screen w-full flex bg-[#000C24] overflow-hidden">
            <Sidebar></Sidebar>
            <section className="grow h-full overflow-auto">
                <div className="p-6 flex w-full justify-between">
                    <h1 className="text-4xl font-bold">INVENTÁRIO</h1>
                    <SearchBar></SearchBar>
                    <button
                        onClick={() => navigate(`adicionar`)}
                        className="flex gap-2 px-6 py-2.5 bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] text-[#003640] rounded-xl shadow-xl shadow-cyan-500/20 cursor-pointer">
                        + Registrar
                    </button>
                </div>
                
                {/* A alteração foi feita na div abaixo: adicionado flex-wrap e removido justify-between */}
                <div className="p-6 flex w-full flex-wrap justify-start gap-4" id="produtos_listagem">
                    {estoque?.filter(estoque => estoque.seAtivo === true).map((estoque) => {
                        return (
                            <CardItemEstoque
                                key={estoque.id}
                                id={estoque.id}
                                dataValidade={estoque.dataValidade ? new Date(estoque.dataValidade).toLocaleDateString() : "Sem validade"}
                                quantidade={estoque.quantidade}
                                atualizarLista={carregarEstoque}
                            />
                        )
                    })}
                </div>
            </section>
        </main>
    )
}