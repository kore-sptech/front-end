import { useEffect, useState } from "react";

import { listarProdutos } from "../../services/produtos";
import { getSession } from "../../utils/auth";

/**
 * Hook: nome do produto usado como elo de contexto na trilha de navegação.
 *
 * Aproveita o nome já conhecido (estado da navegação) e só busca na API quando
 * ele não chegou — por exemplo, ao recarregar a tela de edição. Falhas são
 * silenciosas: a trilha deve degradar para o rótulo genérico, não quebrar a
 * página nem disparar alerta ao usuário.
 *
 * @param {string|number} productId
 * @param {object} [options]
 * @param {string} [options.initialName] Nome vindo do `state` da navegação.
 * @returns {string} Nome do produto ou string vazia enquanto não resolvido.
 */
export function useProductName(productId, { initialName = "" } = {}) {
  const [fetchedName, setFetchedName] = useState("");
  const [isResolved, setIsResolved] = useState(false);

  const shouldFetch = Boolean(productId) && !initialName && !isResolved;

  useEffect(() => {
    if (!shouldFetch) return;

    let active = true;

    async function load() {
      try {
        const { usuarioId } = getSession();
        const response = await listarProdutos(usuarioId);

        if (!active) return;

        const products = Array.isArray(response.data) ? response.data : [];

        const product = products.find(
          (item) => String(item.id) === String(productId),
        );

        setFetchedName(product?.nome || "");
      } catch {
        // Nome é apenas contexto visual: a trilha cai no rótulo genérico.
      }

      if (active) setIsResolved(true);
    }

    void load();

    return () => {
      active = false;
    };
  }, [productId, shouldFetch]);

  return initialName || fetchedName;
}
