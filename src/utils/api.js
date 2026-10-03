import { API_URL } from "../config/env";
import axios from "axios";
import { logout } from "./auth";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    if (!config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const requisicaoDeLogin = url.includes("/auth/login");

    if (status === 401 && !requisicaoDeLogin) {
      logout();
      toast.error("Sua sessão expirou. Faça login novamente.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);
