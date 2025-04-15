import { store } from "@/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { Toaster } from "./ui/toaster";

import AuthLayout from "@/layouts/AuthLayout";
import WaiterLayout from "@/layouts/WaiterLayout";

import Loader from "@/components/Loader.tsx";
import LoginView from "@/modules/auth/login/LoginView";
import NotFoundView from "@/modules/not-found/NotFoundView";

import ErrorView from "@/modules/error/ErrorView";
import ChefLayout from "@/layouts/ChefLayout";
import ChefDashboard from "@/modules/chef/dashboard/ChefDashboard";
import WaiterDashboard from "@/modules/waiter/dashboard/WaiterDashboard";
import TableList from "@/modules/waiter/order/TableList";
import MenuList from "@/modules/waiter/order/MenuList";
import CashierDashboard from "@/modules/cashier/dashboard/CashierDashboard";
import CashierLayout from "@/layouts/CashierLayout";
import DefaultLayout from "@/layouts/DefaultLayout";
import { AuthProvider } from "@/store/AuthContext";
const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout/>
  },
  {
    path: "/waiter",
    element: <WaiterLayout />,
    errorElement: <ErrorView />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      // Dashboard Start
      {
        path: "dashboard",
        element: <WaiterDashboard />,
      },
      {
        path: "orders/tables",
        element: <TableList />,
      },
      {
        path: "orders/tables/:id/menus",
        element: <MenuList />,
      },
      // Dashboard End
     

    ],
  },
  {
    path: "/chef",
    element: <ChefLayout />,
    errorElement: <ErrorView />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      // Dashboard Start
      {
        path: "dashboard",
        element: <ChefDashboard />,
      },
      // Dashboard End

    ],
  },
  {
    path: "/cashier",
    element: <CashierLayout />,
    errorElement: <ErrorView />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      // Dashboard Start
      {
        path: "dashboard",
        element: <CashierDashboard />,
      },
      // Dashboard End

    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="login" replace />,
      },
      {
        path: "login",
        element: <LoginView />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundView />,
  },
]);

const Wrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: import.meta.env.DEV ? false : "always", // close refetch on window focus in development
      },
    },
  });

  return (
    <>
     <AuthProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Loader />
          <Toaster />
          <RouterProvider router={router}></RouterProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
      </AuthProvider>
    </>
  );
};

export default Wrapper;
