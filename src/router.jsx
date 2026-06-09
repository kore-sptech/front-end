import { Navigate, createBrowserRouter } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import TransacoesPage from "./pages/TransacoesPage";
import NotificationsPage from "./pages/NotificationsPage";
import DashboardFinanceiraPage from "./pages/DashboardFinanceiraPage";
import AgendamentosPage from "./pages/AgendamentosPage";
import ProdutoPage from "./pages/Produto/ProdutosPage";
import CadastroProdutoPage from "./pages/Produto/CadastroProdutoPage";
import EditarProdutoPage from "./pages/Produto/EditarProdutoPage";
import EstoquePage from "./pages/Estoque/EstoquePage";
import AdicionarEstoquePage from "./pages/Estoque/AdicionarEstoquePage";

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
        element: <CadastroProdutoPage/>,
      },
      {
        path: "/produtos/editar/:id", // vitor & mira
        element: <EditarProdutoPage />,
      },
      {
        path: "/estoque/:id", // vitor & mira
        element: <EstoquePage/>
      },
      {
        path: "/estoque/:id/adicionar", // vitor
        element: <AdicionarEstoquePage/>
      }
    ],
  },
]);

export { router };
