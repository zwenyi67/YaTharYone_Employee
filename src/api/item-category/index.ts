import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import {
  AddItemCategoryPayloadType,
  GetItemCategoriesType,
  PostResponse,
  UpdateItemCategoryPayloadType,
} from "./types";

const itemCategory_URL = "/admin/item-categories";

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

export const addItemCategory = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      AddItemCategoryPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["addItemCategory"],
      mutationFn: async (payload: AddItemCategoryPayloadType) => {
        const response = await axios.post(
          `${itemCategory_URL}/create`,
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

export const updateItemCategory = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      UpdateItemCategoryPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["updateItemCategory"],
      mutationFn: async (payload: UpdateItemCategoryPayloadType) => {
        const response = await axios.post(
          `${itemCategory_URL}/edit`,
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

export const deleteItemCategory = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      number,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["deleteItemCategory"],
      mutationFn: async (id: number) => {
        const response = await axios.post(
          `${itemCategory_URL}/${id}/delete`
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


