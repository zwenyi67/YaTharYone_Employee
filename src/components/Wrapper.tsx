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
import SupplierView from "@/modules/supplier-management/supplier/SupplierView";
import SupplierFormView from "@/modules/supplier-management/supplier/SupplierFormView";
import WaiterDashboard from "@/modules/dashboard/WaiterDashboard";
import ChefLayout from "@/layouts/ChefLayout";
import ChefDashboard from "@/modules/dashboard/ChefDashboard";
const router = createBrowserRouter([
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

      // Supplier Management Start

      // Suppliers
      {
        path: "supplier-management/suppliers",
        element: <SupplierView />,
      },
      {
        path: "supplier-management/suppliers/create",
        element: <SupplierFormView />,
      },
      {
        path: "supplier-management/suppliers/:id/edit",
        element: <SupplierFormView />,
      },

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
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Loader />
          <Toaster />
          <RouterProvider router={router}></RouterProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Provider>
    </>
  );
};

export default Wrapper;
