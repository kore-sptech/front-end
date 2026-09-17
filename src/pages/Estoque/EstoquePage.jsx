import { useEffect, useState } from "react";

import CardItemEstoque from "../../components/CardItemEstoque";
import SearchBar from "../../components/SearchBar";
import Sidebar from "../../components/Sidebar";
import { api } from "../../utils/api";
import { handleApiError } from "../../utils/errorHandler";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function EstoquePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [estoque, setEstoque] = useState([]);
  const [imagemProduto, setImagemProduto] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregarEstoque() {
      try {
        const usuarioId = localStorage.getItem("usuarioId");
        const [estoqueResponse, produtosResponse] = await Promise.all([
          api.get(`/estoque/${id}`),
          api.get(`/produtos/${usuarioId}`),
        ]);

        const estoqueData = Array.isArray(estoqueResponse.data)
          ? estoqueResponse.data
          : [];
        const produtosData = Array.isArray(produtosResponse.data)
          ? produtosResponse.data
          : [];

        const produtoSelecionado = produtosData.find(
          (produto) => String(produto.id) === String(id),
        );

        if (!ativo) {
          return;
        }

        setEstoque(estoqueData);
        setImagemProduto(produtoSelecionado?.imagemKey || "");
      } catch (err) {
        if (!ativo) {
          return;
        }

        if (err.response?.status === 204) {
          setEstoque([]);
          return;
        }

        handleApiError(err, "Não foi possível carregar o estoque.");
      }
    }

    if (id) {
      void carregarEstoque();
    }

    return () => {
      ativo = false;
    };
  }, [id, reloadToken]);

  const estoqueAtivo = Array.isArray(estoque)
    ? estoque.filter((item) => item.seAtivo === true)
    : [];

  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#000C24]">
      <Sidebar></Sidebar>
      <section className="h-full grow overflow-auto">
        <div className="flex w-full justify-between p-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">PRODUTOS</h1>

            <span className="block h-1 w-12 rounded-3xl bg-[#48DCFC]" />
          </div>
          <SearchBar></SearchBar>
          <button
            onClick={() => navigate(`adicionar`)}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-[#48DCFC] to-[#0CC0DF] px-6 py-2.5 font-bold text-[#003640] shadow-xl shadow-cyan-500/20"
          >
            + Registrar
          </button>
        </div>

        {/* A alteração foi feita na div abaixo: adicionado flex-wrap e removido justify-between */}
        <div
          className="flex w-full flex-wrap justify-start gap-4 p-6"
          id="produtos_listagem"
        >
          {estoqueAtivo.length == 0 && (
            <div className="mt-70 h-full w-full text-center">
              <p className="text-4xl font-bold text-[#DAE2FF]">
                NENHUM ITEM NO ESTOQUE!
              </p>
              <p className="text-2xl">
                Cadastre um item{" "}
                <button
                  onClick={() => navigate(`adicionar`)}
                  className="cursor-pointer font-bold text-[#48DCFC] underline"
                >
                  clicando aqui!
                </button>
              </p>
            </div>
          )}

          {estoqueAtivo.map((estoque) => {
            return (
              <CardItemEstoque
                key={estoque.id}
                id={estoque.id}
                dataValidade={
                  estoque.dataValidade
                    ? new Date(estoque.dataValidade).toLocaleDateString()
                    : "Sem validade"
                }
                quantidade={estoque.quantidade}
                valorUnitario={estoque.valorUnitario}
                imagem={imagemProduto}
                atualizarLista={() => setReloadToken((current) => current + 1)}
              />
            );
          })}
        </div>
      </section>
    </main>
  );
}
