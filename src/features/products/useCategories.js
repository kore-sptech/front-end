import { useCallback, useEffect, useState } from "react";

import { criarCategoria, listarCategorias } from "../../services/produtos";
import { handleApiError } from "../../utils/errorHandler";

/**
 * Hook: lista de categorias do usuário + criação inline.
 *
 * @param {string} usuarioId Dono da lista de categorias.
 * @returns {{categories: object[], isSaving: boolean, create: (dados: {nome: string, descricao: string}) => Promise<object>}}
 */
export function useCategories(usuarioId) {
  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let ativo = true;

    listarCategorias(usuarioId)
      .then(({ data }) => {
        if (ativo) setCategories(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        handleApiError(error, "Erro ao carregar categorias.");
        if (ativo) setCategories([]);
      });

    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  const create = useCallback(
    async (dados) => {
      setIsSaving(true);

      try {
        const { data } = await criarCategoria(usuarioId, dados);

        setCategories((prev) => [...prev, data]);

        return data;
      } catch (error) {
        handleApiError(error, "Erro ao criar categoria.");

        throw error;
      } finally {
        setIsSaving(false);
      }
    },
    [usuarioId],
  );

  return { categories, isSaving, create };
}