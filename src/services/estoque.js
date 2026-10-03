import { api } from "../utils/api";

export function listarEstoque(produtoId) {
  return api.get(`/estoque/${produtoId}`);
}

export function adicionarEstoque(produtoId, quantidade, dados) {
  return api.post(`/estoque/${quantidade}/${produtoId}`, dados);
}

export function excluirItemEstoque(itemId) {
  return api.delete(`/estoque/${itemId}`);
}

export function listarEstoqueDoAgendamento(agendamentoId) {
  return api.get(`/estoque/agendamento/${agendamentoId}`);
}

export function associarItemEstoque(itemId, agendamentoId) {
  return api.put(`/estoque/${itemId}/${agendamentoId}`, {});
}
