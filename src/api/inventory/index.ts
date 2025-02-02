import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import {
  AddInventoryPayloadType,
  GetInventoriesType,
  GetItemCategoriesType,
  PostResponse,
  UpdateInventoryPayloadType,
} from "./types";

const inventory_URL = "/admin/inventories";
const itemCategory_URL = "/admin/item-categories";

export const getInventories = {
  useQuery: (opt?: UseQueryOptions<GetInventoriesType[], Error>) =>
    useQuery<GetInventoriesType[], Error>({
      queryKey: ["getInventories"],
      queryFn: async () => {
        const response = await axios.get(`${inventory_URL}`);

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

export const getItemCategories = {
  useQuery: (opt?: UseQueryOptions<GetItemCategoriesType[], Error>) =>
    useQuery<GetItemCategoriesType[], Error>({
      queryKey: ["getItemCategories"],
      queryFn: async () => {
        const response = await axios.get(`${itemCategory_URL}`);

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

export const addInventory = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      AddInventoryPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["addInventory"],
      mutationFn: async (payload: AddInventoryPayloadType) => {
        const response = await axios.post(
          `${inventory_URL}/create`,
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

export const updateInventory = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      UpdateInventoryPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["updateInventory"],
      mutationFn: async (payload: UpdateInventoryPayloadType) => {
        const response = await axios.post(
          `${inventory_URL}/edit`,
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

export const deleteInventory = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      number,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["deleteInventory"],
      mutationFn: async (id: number) => {
        const response = await axios.post(
          `${inventory_URL}/${id}/delete`
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


