import { jwtDecode } from "jwt-decode";

export function getToken() {
  return localStorage.getItem("token");
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
  const token = getToken();
  return isTokenValido(token);
}

export function logout() {
  localStorage.removeItem("token");
}
