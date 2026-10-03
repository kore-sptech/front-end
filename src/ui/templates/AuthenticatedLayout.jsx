import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import ConfirmDialog from "../molecules/ConfirmDialog";
import Sidebar from "../organisms/Sidebar";
import { logout } from "../../utils/auth";

/**
 * Template: shell das telas autenticadas (sidebar + área de conteúdo).
 *
 * @returns {React.ReactElement}
 */
export default function AuthenticatedLayout() {
  const navigate = useNavigate();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const confirmLogout = () => {
    setIsLogoutOpen(false);

    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#000C24]">
      <Sidebar onRequestLogout={() => setIsLogoutOpen(true)} />

      <main className="min-w-0 grow overflow-hidden">
        <Outlet />
      </main>

      <ConfirmDialog
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        title="Deseja sair da sua conta?"
        description="Você precisará entrar novamente para acessar o painel."
        warning=""
        confirmLabel="Sair"
        confirmVariant="danger"
        onConfirm={confirmLogout}
      />
    </div>
  );
}