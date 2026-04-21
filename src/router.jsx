import { createBrowserRouter } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import TransacoesPage from "./pages/TransacoesPage";
import DashboardFinanceiraPage from "./pages/DashboardFinanceiraPage";
import AgendamentosPage from "./pages/AgendamentosPage";

const router = createBrowserRouter([
  {
    children: [
      {
        path: "/login", // carol
        element: <LoginPage />,
      },
      {
        path: "/signup", // carol
        element: <SignUpPage />,
      },
      {
        path: "/dashboard", // mira
        element: <DashboardPage />,
      },
      {
        path: "/dashboard-financeiro", // diogo
        element: <DashboardFinanceiraPage />,
      },
      {
        path: "/transacoes", // diogo
        element: <TransacoesPage />,
      },
      {
        path: "/agendamentos", // henry
        element: <AgendamentosPage />,
      },
    ],
  },
]);

export { router };
