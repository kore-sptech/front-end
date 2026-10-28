import { api } from "../utils/api";
import { SSE_URL } from "../config/env";

export function abrirStreamDeNotificacoes() {
  return new EventSource(`${SSE_URL}/sse/stream`);
}

export async function listarNotificacoes() {
  const response = await api.get("/notificacoes");
  return response.data;
}

export async function marcarComoLida(id) {
  const response = await api.patch(`/notificacoes/${id}/lida`);
  return response.data;
}

export async function ignorarNotificacao(id) {
  const response = await api.patch(`/notificacoes/${id}/ignorar`);
  return response.data;
}
