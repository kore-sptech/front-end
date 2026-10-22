import { useCallback, useEffect, useState } from "react";

import { listarEstoque } from "../../services/estoque";
import { listarProdutos } from "../../services/produtos";
import { getSession } from "../../utils/auth";
import { handleApiError } from "../../utils/errorHandler";

/**
 * Hook: produtos disponíveis para um agendamento e itens de estoque de cada
 * produto. Usado pelo seletor de materiais em dois passos.
 *
 * @returns {{products: object[], items: object[], isLoading: boolean, selectProduct: (product: object) => void}}
 */
export function useMaterialOptions() {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ativo = true;
    const { usuarioId } = getSession();

    listarProdutos(usuarioId)
      .then(({ data }) => {
        if (ativo) setProducts(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        handleApiError(error, "Não foi possível carregar os produtos.");
        if (ativo) setProducts([]);
      })
      .finally(() => {
        if (ativo) setIsLoading(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const selectProduct = useCallback((product) => {
    setIsLoading(true);

    listarEstoque(product.id)
      .then(({ data }) => setItems(Array.isArray(data) ? data : []))
      .catch((error) => {
        handleApiError(error, "Não foi possível carregar os itens do produto.");
        setItems([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { products, items, isLoading, selectProduct };
}