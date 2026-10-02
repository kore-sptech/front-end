import { api } from "../utils/api";

export function entrar(email, senha) {
  return api.post("/auth/login", { email, senha });
}

export function cadastrarUsuario(dados) {
  return api.post("/usuarios", dados);
}
