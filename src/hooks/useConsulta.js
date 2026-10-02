import { useCallback, useEffect, useState } from "react";

export function useConsulta(consulta) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const recarregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const resultado = await consulta();
      setDados(resultado);
      return resultado;
    } catch (erroAtual) {
      setErro(erroAtual);
      throw erroAtual;
    } finally {
      setCarregando(false);
    }
  }, [consulta]);

  useEffect(() => {
    void Promise.resolve().then(() => recarregar());
  }, [recarregar]);

  return { dados, carregando, erro, recarregar };
}
