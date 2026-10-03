import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  ALL_CATEGORIES,
  PRODUCT_FILTER_PARAMS,
} from "../../constants/products";
import { listarCategorias, listarProdutos } from "../../services/produtos";
import { handleApiError } from "../../utils/errorHandler";

/**
 * Hook: lista de produtos + categorias com busca e filtro por categoria.
 *
 * Busca e categoria são lidas da query string (`?pesquisa=` e `?categoria=`),
 * então os filtros sobrevivem a recarregar a página (F5) e ficam contidos em
 * links compartilháveis. Valores padrão são omitidos da URL para mantê-la limpa.
 *
 * @param {object} [options]
 * @param {string} [options.usuarioId]
 * @returns {object} Produtos filtrados, categorias e setters.
 */
export function useProducts({ usuarioId } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const search = searchParams.get(PRODUCT_FILTER_PARAMS.search) ?? "";
  const requestedCategoryId =
    searchParams.get(PRODUCT_FILTER_PARAMS.category) ?? ALL_CATEGORIES;

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          listarProdutos(usuarioId),
          listarCategorias(usuarioId),
        ]);

        if (!active) return;

        setProducts(
          Array.isArray(productsResponse.data) ? productsResponse.data : [],
        );
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

  const categoryId = useMemo(() => {
    if (requestedCategoryId === ALL_CATEGORIES) return ALL_CATEGORIES;

    // Enquanto as categorias não chegam, o filtro da URL é respeitado.
    if (categories.length === 0) return requestedCategoryId;

    const exists = categories.some(
      (category) => String(category.id) === requestedCategoryId,
    );

    return exists ? requestedCategoryId : ALL_CATEGORIES;
  }, [categories, requestedCategoryId]);

  // Categoria que não existe mais não pode deixar a listagem vazia sem explicação.
  useEffect(() => {
    if (
      requestedCategoryId === ALL_CATEGORIES ||
      categoryId !== ALL_CATEGORIES
    ) {
      return;
    }

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(PRODUCT_FILTER_PARAMS.category);
        return next;
      },
      { replace: true },
    );
  }, [categoryId, requestedCategoryId, setSearchParams]);

  const setSearch = useCallback(
    (value) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const term = String(value ?? "");

          if (term) next.set(PRODUCT_FILTER_PARAMS.search, term);
          else next.delete(PRODUCT_FILTER_PARAMS.search);

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setCategoryId = useCallback(
    (value) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          const category = String(value ?? ALL_CATEGORIES);

          if (category === ALL_CATEGORIES) {
            next.delete(PRODUCT_FILTER_PARAMS.category);
          } else {
            next.set(PRODUCT_FILTER_PARAMS.category, category);
          }

          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesName = product.nome.toLowerCase().includes(term);

      const productCategoryId =
        product.categoria?.id ?? product.categoriaId ?? product.fk_categoria;

      const matchesCategory =
        categoryId === ALL_CATEGORIES ||
        String(productCategoryId) === String(categoryId);

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
