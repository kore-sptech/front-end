import { useCallback } from "react";

import { listarProdutos } from "../servicos/produtos";
import { useConsulta } from "./useConsulta";

export function useProdutos(usuarioId) {
  const consulta = useCallback(
    async () => {
      const resposta = await listarProdutos(usuarioId);
      return resposta.data;
    },
    [usuarioId],
  );

  return useConsulta(consulta);
}
