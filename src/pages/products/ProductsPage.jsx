import { Plus } from "lucide-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Button from "../../ui/atoms/Button";
import EmptyState from "../../ui/molecules/EmptyState";
import FilterChips from "../../ui/molecules/FilterChips";
import PageHeader from "../../ui/molecules/PageHeader";
import ProductCard from "../../ui/molecules/ProductCard";
import SearchInput from "../../ui/molecules/SearchInput";
import { toast } from "sonner";
import { getSession } from "../../utils/auth";
import { useProducts } from "../../features/products/useProducts";

const ALL_CATEGORIES = "todos";

/**
 * Page: listagem de produtos com busca e filtro por categoria.
 *
 * @returns {React.ReactElement}
 */
export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuarioId } = getSession();

  const { products, categories, search, setSearch, categoryId, setCategoryId } =
    useProducts({ usuarioId });

  const { successMessage, successMessage2, successMessage3 } = location.state ?? {};

  useEffect(() => {
    const message = successMessage || successMessage2 || successMessage3;

    if (!message) return;

    toast.success(message);
    window.history.replaceState({}, document.title);
  }, [successMessage, successMessage2, successMessage3]);

  const goToRegister = () => navigate("cadastro", { state: { pesquisa: search } });

  const categoryOptions = [
    { value: ALL_CATEGORIES, label: "Todos" },
    ...categories.map((category) => ({
      value: String(category.id),
      label: category.nome,
    })),
  ];

  return (
    <main className="relative h-full w-full overflow-y-auto bg-[#000C24]">
      <PageHeader
        title="PRODUTOS"
        className="p-4 sm:p-6"
        actions={
          <>
            <SearchInput
              className="max-w-sm"
              value={search}
              onChange={setSearch}
              placeholder="Buscar produto..."
            />

            <Button onClick={goToRegister} className="whitespace-nowrap">
              <Plus size={20} />
              Registrar
            </Button>
          </>
        }
      />

      <FilterChips
        variant="chips"
        className="px-4 pb-4 sm:px-6"
        options={categoryOptions}
        value={categoryId}
        onChange={setCategoryId}
      />

      <div className="grid grid-cols-1 justify-items-center gap-6 px-4 pb-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 xl:grid-cols-4">
        {products.length === 0 ? (
          <EmptyState
            title={
              search
                ? `NENHUM ITEM NO INVENTÁRIO PARA "${search}"!`
                : "NENHUM ITEM NO INVENTÁRIO"
            }
            description={
              search ? "Tente outro termo de busca." : "Registre seus produtos para começar."
            }
            action={{ label: "Registrar produto", onClick: goToRegister }}
          />
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.nome}
              quantity={(product.itens ?? []).filter((item) => item.seAtivo).length}
              type={product.tipo}
              imageUrl={product.imagemKey}
              onClick={() => navigate(`/estoque/${product.id}`)}
              onEdit={() =>
                navigate(`/produtos/editar/${product.id}`, {
                  state: {
                    nome: product.nome,
                    quantidade: product.quantidade,
                    descricao: product.descricao,
                    possuiValidade: product.possuiValidade,
                    tipo: product.tipo,
                    imagem: product.imagemKey,
                    qtdMinAlerta:
                      product.qtdMinAlerta ?? product.quantidadeMinimaAlerta,
                    categoriaId:
                      product.categoria?.id ?? product.categoriaId ?? product.fk_categoria,
                  },
                })
              }
            />
          ))
        )}
      </div>
    </main>
  );
}