import { useCallback } from "react";

import { listarAgendamentos } from "../servicos/agendamentos";
import { useConsulta } from "./useConsulta";

export function useAgendamentos(inicio, fim) {
  const consulta = useCallback(
    async () => {
      const resposta = await listarAgendamentos(inicio, fim);
      return resposta.data;
    },
    [inicio, fim],
  );

  return useConsulta(consulta);
}
