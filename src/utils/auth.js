import { jwtDecode } from "jwt-decode";

const CHAVES_SESSAO = ["nome", "token", "usuarioId"];

export function getToken() {
  // Fase 2: retornar null e deixar o cookie ser enviado automaticamente
  return localStorage.getItem("token");
}

export function getSession() {
  return {
    token: localStorage.getItem("token"),
    nome: localStorage.getItem("nome"),
    usuarioId: localStorage.getItem("usuarioId"),
  };
}

export function saveSession(session) {
  localStorage.setItem("nome", session.nome);
  localStorage.setItem("token", session.token);
  localStorage.setItem("usuarioId", String(session.id));
}

export function isTokenValido(token) {
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function isAutenticado() {
  return isTokenValido(getToken());
}

export function logout() {
  CHAVES_SESSAO.forEach((chave) => localStorage.removeItem(chave));
}
