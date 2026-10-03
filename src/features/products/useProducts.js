import { useEffect, useMemo, useState } from "react";

import { listarCategorias, listarProdutos } from "../../services/produtos";
import { handleApiError } from "../../utils/errorHandler";

/**
 * Hook: lista de produtos + categorias com busca e filtro por categoria.
 *
 * @param {object} [options]
 * @param {string} [options.usuarioId]
 * @returns {object} Produtos filtrados, categorias e setters.
 */
export function useProducts({ usuarioId } = {}) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("todos");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          listarProdutos(usuarioId),
          listarCategorias(usuarioId),
        ]);

        if (!active) return;

        setProducts(Array.isArray(productsResponse.data) ? productsResponse.data : []);
        setCategories(
          Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [],
        );
      } catch (error) {
        if (!active) return;

        handleApiError(error, "Não foi possível carregar os produtos.");
        setProducts([]);
        setCategories([]);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [usuarioId]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesName = product.nome.toLowerCase().includes(term);

      const productCategoryId =
        product.categoria?.id ?? product.categoriaId ?? product.fk_categoria;

      const matchesCategory =
        categoryId === "todos" || String(productCategoryId) === String(categoryId);

      return matchesName && matchesCategory;
    });
  }, [categoryId, products, search]);

  return {
    products: filteredProducts,
    categories,
    search,
    setSearch,
    categoryId,
    setCategoryId,
  };
}