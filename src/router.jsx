import { Navigate, createBrowserRouter } from "react-router-dom";

import AdicionarEstoquePage from "./pages/Estoque/AdicionarEstoquePage";
import AgendamentosPage from "./pages/AgendamentosPage";
import CadastroProdutoPage from "./pages/Produto/CadastroProdutoPage";
import DashboardFinanceiraPage from "./pages/DashboardFinanceiraPage";
import DashboardPage from "./pages/DashboardPage";
import EditarProdutoPage from "./pages/Produto/EditarProdutoPage";
import EstoquePage from "./pages/Estoque/EstoquePage";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import { PrivateRoute } from "./components/PrivateRoute";
import ProdutoPage from "./pages/Produto/ProdutosPage";
import SignUpPage from "./pages/SignUpPage";
import TestValidationPage from "./pages/TestValidationPage";
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
        path: "/test-validation",
        element: <TestValidationPage />,
      },
      {
        element: <PrivateRoute />,
        children: [
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
          {
            path: "/notificacoes", // diogo
            element: <NotificationsPage />,
          },
          {
            path: "/produtos", // vitor & mira
            element: <ProdutoPage />,
          },
          {
            path: "/produtos/cadastro", // vitor & mira
            element: <CadastroProdutoPage />,
          },
          {
            path: "/produtos/editar/:id", // vitor & mira
            element: <EditarProdutoPage />,
          },
          {
            path: "/estoque/:id", // vitor & mira
            element: <EstoquePage />,
          },
          {
            path: "/estoque/:id/adicionar", // vitor
            element: <AdicionarEstoquePage />,
          },
        ],
      },
    ],
  },
]);

export { router };
