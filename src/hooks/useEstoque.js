import { useCallback } from "react";

import { listarEstoque } from "../servicos/estoque";
import { useConsulta } from "./useConsulta";

export function useEstoque(produtoId) {
  const consulta = useCallback(
    async () => {
      const resposta = await listarEstoque(produtoId);
      return resposta.data;
    },
    [produtoId],
  );

  return useConsulta(consulta);
}
