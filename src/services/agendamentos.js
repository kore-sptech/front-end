import { api } from "../utils/api";

export function listarAgendamentos(inicio, fim) {
  return api.get("/agendamentos", {
    params: { inicio, fim },
  });
}

export function buscarProximoDisponivel() {
  return api.get("/agendamentos/proximo-disponivel");
}

export function criarAgendamento(dados) {
  return api.post("/agendamentos", dados);
}

export function atualizarAgendamento(id, dados) {
  return api.put(`/agendamentos/${id}`, dados);
}

export function confirmarAgendamento(id) {
  return api.patch(`/agendamentos/confirmar/${id}`, {});
}

export function confirmarPagamento(id) {
  return api.patch(`/agendamentos/confirmar_pagamento/${id}`, {});
}

export function cancelarAgendamento(id) {
  return api.patch(`/agendamentos/cancelar/${id}`, {});
}
