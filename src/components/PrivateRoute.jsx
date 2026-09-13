import { Navigate, Outlet } from "react-router-dom";
import { isAutenticado, logout } from "../utils/auth";

import { toast } from "sonner";
import { useEffect } from "react";

export function PrivateRoute() {
  const token = localStorage.getItem("token");
  const autenticado = isAutenticado();

  useEffect(() => {
    if (!token) {
      toast.error("Você precisa estar logado para acessar esta página");
    } else if (!autenticado) {
      logout();
      toast.error("Sua sessão expirou. Faça login novamente.");
    }
  }, []);

  if (!token || !autenticado) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
