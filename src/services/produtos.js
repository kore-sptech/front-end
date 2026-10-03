import { api } from "../utils/api";

export function listarTodosProdutos() {
  return api.get("/produtos");
}

export function listarProdutos(usuarioId) {
  return api.get(`/produtos/${usuarioId}`);
}

export function listarCategorias(usuarioId) {
  return api.get(`/categorias/${usuarioId}`);
}

export function criarCategoria(usuarioId, dados) {
  return api.post(`/categorias/${usuarioId}`, dados);
}

export function criarProduto(usuarioId, dados) {
  return api.post(`/produtos/${usuarioId}`, dados);
}

export function atualizarProduto(usuarioId, id, dados) {
  return api.put(`/produtos/${usuarioId}/${id}`, dados);
}

export function excluirProduto(usuarioId, id) {
  return api.delete(`/produtos/${usuarioId}/${id}`);
}

export function enviarImagemProduto(id, arquivo) {
  const dados = new FormData();
  dados.append("imagem", arquivo);
  return api.post(`/produtos/${id}/imagem`, dados);
}
