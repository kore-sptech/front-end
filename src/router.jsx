import { createBrowserRouter } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import TransacoesPage from "./pages/TransacoesPage";
import DashboardFinanceiraPage from "./pages/DashboardFinanceiraPage";
import AgendamentosPage from "./pages/AgendamentosPage";
import ProdutoPage from "./pages/Produto/ProdutosPage";
import CadastroProdutoPage from "./pages/Produto/CadastroProdutoPage";
import EditarProdutoPage from "./pages/Produto/EditarProdutoPage";

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
      {
        path: "/produtos", // vitor
        element: <ProdutoPage />,
      },
      {
        path: "/produtos/cadastro", // vitor
        element: <CadastroProdutoPage />,
      },
      {
        path: "/produtos/editar", // vitor
        element: <EditarProdutoPage />,
      }
    ],
  },
]);

export { router };
