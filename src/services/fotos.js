import { api } from "../utils/api";

export function enviarFoto(arquivo) {
  const dados = new FormData();
  dados.append("foto", arquivo);
  return api.post("/fotos", dados);
}
