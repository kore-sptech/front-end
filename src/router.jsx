import { Navigate, createBrowserRouter } from "react-router-dom";

import AgendamentosPage from "./pages/AgendamentosPage";
import DashboardFinanceiraPage from "./pages/DashboardFinanceiraPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TransacoesPage from "./pages/TransacoesPage";

const router = createBrowserRouter([
  {
    children: [
      {
        path: "/",
        element: <Navigate to="/login" replace />,
      },
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
