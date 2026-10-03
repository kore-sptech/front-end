import { api } from "../utils/api";

export function listarMetricas() {
  return api.get("/transacoes/metricas");
}

export function listarTransacoes(parametros = {}) {
  return api.get("/transacoes", { params: parametros });
}

export function criarTransacao(dados) {
  return api.post("/transacoes", dados);
}

export function atualizarTransacao(id, dados) {
  return api.put(`/transacoes/${id}`, dados);
}

export function excluirTransacao(id) {
  return api.delete(`/transacoes/${id}`);
}

export function criarTransacaoDoAgendamento(agendamentoId, dados) {
  return api.post(`/transacoes/${agendamentoId}`, dados);
}
