import { useCallback } from "react";

import { listarTransacoes } from "../servicos/transacoes";
import { useConsulta } from "./useConsulta";

export function useTransacoes(parametros) {
  const consulta = useCallback(
    async () => {
      const resposta = await listarTransacoes(parametros);
      return resposta.data;
    },
    [parametros],
  );

  return useConsulta(consulta);
}
