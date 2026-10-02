import { SSE_URL } from "../config/env";

export function abrirStreamDeNotificacoes() {
  return new EventSource(`${SSE_URL}/sse/stream`);
}
