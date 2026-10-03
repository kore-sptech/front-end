import { useCallback, useEffect, useState } from "react";

import { handleApiError } from "../../utils/errorHandler";
import { listarProdutos } from "../../services/produtos";
import { excluirItemEstoque, listarEstoque } from "../../services/estoque";
import { getSession } from "../../utils/auth";

/**
 * Hook: itens de estoque de um produto + imagem do produto para os cards.
 *
 * @param {object} options
 * @param {string|number} options.productId
 * @returns {object} Itens, busca filtrada e `refresh`.
 */
export function useStockItems({ productId } = {}) {
  const [items, setItems] = useState([]);
  const [productImage, setProductImage] = useState("");
  const [search, setSearch] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!productId) return;

      try {
        const { usuarioId } = getSession();

        const [stockResponse, productsResponse] = await Promise.all([
          listarEstoque(productId),
          listarProdutos(usuarioId),
        ]);

        if (!active) return;

        const products = Array.isArray(productsResponse.data)
          ? productsResponse.data
          : [];

        const product = products.find(
          (item) => String(item.id) === String(productId),
        );

        setItems(Array.isArray(stockResponse.data) ? stockResponse.data : []);
        setProductImage(product?.imagemKey || "");
      } catch (error) {
        if (!active) return;

        if (error.response?.status === 204) {
          setItems([]);
          return;
        }

        handleApiError(error, "Não foi possível carregar o estoque.");
        setItems([]);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [productId, reloadToken]);

  const remove = useCallback(
    async (itemId) => {
      const { status } = await excluirItemEstoque(itemId);

      if (status !== 204) {
        throw new Error("Exclusão sem confirmação do servidor.");
      }

      refresh();
    },
    [refresh],
  );

  const visibleItems = items.filter((item) =>
    `${item.nome || ""} ${item.descricao || ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return {
    items: visibleItems,
    productImage,
    search,
    setSearch,
    remove,
    refresh,
  };
}