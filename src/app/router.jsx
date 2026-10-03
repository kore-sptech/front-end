import { Navigate, createBrowserRouter } from "react-router-dom";

import AuthenticatedLayout from "../ui/templates/AuthenticatedLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import FinanceDashboardPage from "../pages/dashboard/FinanceDashboardPage";
import InventoryPage from "../pages/inventory/InventoryPage";
import LoginPage from "../pages/auth/LoginPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import PrivateRoute from "./PrivateRoute";
import ProductCreatePage from "../pages/products/ProductCreatePage";
import ProductEditPage from "../pages/products/ProductEditPage";
import ProductsPage from "../pages/products/ProductsPage";
import SchedulePage from "../pages/scheduling/SchedulePage";
import SignUpPage from "../pages/auth/SignUpPage";
import StockEntryPage from "../pages/inventory/StockEntryPage";
import TestValidationPage from "../pages/dev/TestValidationPage";
import TransactionsPage from "../pages/transactions/TransactionsPage";

/**
 * Tabela de rotas da aplicação.
 *
 * Rotas preservadas da versão anterior; a diferença é apenas a composição:
 * `PrivateRoute` → `AuthenticatedLayout` → página.
 */
const router = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <AuthenticatedLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to="/login" replace />,
          },
          { path: "/dashboard", element: <DashboardPage /> },
          {
            path: "/dashboard-financeiro",
            element: <FinanceDashboardPage />,
          },
          { path: "/transacoes", element: <TransactionsPage /> },
          { path: "/agendamentos", element: <SchedulePage /> },
          { path: "/notificacoes", element: <NotificationsPage /> },
          { path: "/produtos", element: <ProductsPage /> },
          { path: "/produtos/cadastro", element: <ProductCreatePage /> },
          { path: "/produtos/editar/:id", element: <ProductEditPage /> },
          { path: "/estoque/:id", element: <InventoryPage /> },
          { path: "/estoque/:id/adicionar", element: <StockEntryPage /> },
        ],
      },
    ],
  },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/test-validation", element: <TestValidationPage /> },
  { path: "*", element: <Navigate to="/login" replace /> },
]);

export { router };
