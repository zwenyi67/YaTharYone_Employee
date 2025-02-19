import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import {
  GetMenuCategoriesType,
  GetMenusType,
  GetPrevOrderType,
  GetTablesType,
  PostResponse,
  ProceedOrderPayloadType,
  RequestBillPayloadType,
  ServeOrderPayloadType,
  UpdateSupplierPayloadType,
} from "./types";

const table_URL = "/waiter/tableList";
const currentTable_URL = "/waiter/currentTableList"
const menu_URL = "/waiter/menus";
const menuCategory_URL = "/waiter/menu-categories";
const order_URL = "/waiter/orders";

export const getTables = {
  useQuery: (opt?: UseQueryOptions<GetTablesType[], Error>) =>
    useQuery<GetTablesType[], Error>({
      queryKey: ["getTables"],
      queryFn: async () => {
        const response = await axios.get(`${table_URL}`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const currentTableList = {
  useQuery: (opt?: UseQueryOptions<GetTablesType[], Error>) =>
    useQuery<GetTablesType[], Error>({
      queryKey: ["currentTableList"],
      queryFn: async () => {
        const response = await axios.get(`${currentTable_URL}`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const getMenus = {
  useQuery: (opt?: UseQueryOptions<GetMenusType[], Error>) =>
    useQuery<GetMenusType[], Error>({
      queryKey: ["getMenus"],
      queryFn: async () => {
        const response = await axios.get(`${menu_URL}`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const getMenuCategories = {
  useQuery: (opt?: UseQueryOptions<GetMenuCategoriesType[], Error>) =>
    useQuery<GetMenuCategoriesType[], Error>({
      queryKey: ["getMenuCategories"],
      queryFn: async () => {
        const response = await axios.get(`${menuCategory_URL}`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const getOrderById = {
  useQuery: (orderId: number | null, opt?: UseQueryOptions<GetPrevOrderType[], Error>) =>
    useQuery<GetPrevOrderType[], Error>({
      queryKey: ["getOrderById", orderId],
      queryFn: async () => {
        if (!orderId) throw new Error("Order ID is required");
        const response = await axios.get(`${order_URL}/getOrderById?orderId=${orderId}`);
        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      enabled: !!orderId, // Only run if orderId is valid
      ...opt,
    }),
};

export const readyOrderList = {
  useQuery: (opt?: UseQueryOptions<GetPrevOrderType[], Error>) =>
    useQuery<GetPrevOrderType[], Error>({
      queryKey: ["readyOrderList"],
      queryFn: async () => {
        const response = await axios.get(`${order_URL}/readyOrderList`);

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      throwOnError: true,
      ...opt,
    }),
};

export const proceedOrder = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      ProceedOrderPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["proceedOrder"],
      mutationFn: async (payload: ProceedOrderPayloadType) => {
        const response = await axios.post(
          `${order_URL}/proceedOrder`,
          payload
        )

        const { data, status, message } = response.data

        if (status !== 0) {
          throw new Error(
            message ||
            "An error occurred while processing the request."
          )
        }

        return data
      },
      ...opt,
    })
  },
}

export const serveOrder = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      ServeOrderPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["serveOrder"],
      mutationFn: async (payload: ServeOrderPayloadType) => {
        const response = await axios.post(
          `${order_URL}/serveOrder`,
          payload
        )

        const { data, status, message } = response.data

        if (status !== 0) {
          throw new Error(
            message ||
            "An error occurred while processing the request."
          )
        }
        return data
      },
      ...opt,
    })
  },
}

export const requestBill = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      RequestBillPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["requestBill"],
      mutationFn: async (payload: RequestBillPayloadType) => {
        const response = await axios.post(
          `${order_URL}/requestBill`,
          payload
        )

        const { data, status, message } = response.data

        if (status !== 0) {
          throw new Error(
            message ||
            "An error occurred while processing the request."
          )
        }
        return data
      },
      ...opt,
    })
  },
}

export const updateSupplier = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      UpdateSupplierPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["updateSupplier"],
      mutationFn: async (payload: UpdateSupplierPayloadType) => {
        const response = await axios.post(
          `${table_URL}/edit`,
          payload
        )

        const { data, status, message } = response.data

        if (status !== 0) {
          throw new Error(
            message ||
            "An error occurred while processing the request."
          )
        }

        return data
      },
      ...opt,
    })
  },
}

export const deleteSupplier = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      number,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["deleteSupplier"],
      mutationFn: async (id: number) => {
        const response = await axios.post(
          `${table_URL}/${id}/delete`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(
            message || "An error occurred while processing the request."
          );
        }

        return data;
      },
      ...opt,
    });
  },
};


