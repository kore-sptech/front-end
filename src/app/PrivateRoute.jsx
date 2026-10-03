import { Navigate, Outlet, useLocation } from "react-router-dom";

import { getToken, isAutenticado, logout } from "../utils/auth";
import { toast } from "sonner";
import { useEffect } from "react";

/**
 * Route guard: exige token válido e redireciona para `/login` caso contrário.
 *
 * @returns {React.ReactElement}
 */
export default function PrivateRoute() {
  const token = getToken();
  const authenticated = isAutenticado();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      toast.error("Você precisa estar logado para acessar esta página");
    } else if (!authenticated) {
      logout();
      toast.error("Sua sessão expirou. Faça login novamente.");
    }
  }, [authenticated, token]);

  if (!token || !authenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}