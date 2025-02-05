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
  GetTablesType,
  PostResponse,
  ProceedOrderPayloadType,
  UpdateSupplierPayloadType,
} from "./types";

const table_URL = "/waiter/tables";
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


