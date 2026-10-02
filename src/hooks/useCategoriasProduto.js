import { useCallback } from "react";

import { listarCategorias } from "../servicos/produtos";
import { useConsulta } from "./useConsulta";

export function useCategoriasProduto(usuarioId) {
  const consulta = useCallback(
    async () => {
      const resposta = await listarCategorias(usuarioId);
      return resposta.data;
    },
    [usuarioId],
  );

  return useConsulta(consulta);
}
