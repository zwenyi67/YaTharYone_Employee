import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import {
  AddMenuCategoryPayloadType,
  GetMenuCategoriesType,
  PostResponse,
  UpdateMenuCategoryPayloadType,
} from "./types";

const menuCategory_URL = "/admin/menu-categories";

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

export const addMenuCategory = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      AddMenuCategoryPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["addMenuCategory"],
      mutationFn: async (payload: AddMenuCategoryPayloadType) => {
        const response = await axios.post(
          `${menuCategory_URL}/create`,
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

export const updateMenuCategory = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      UpdateMenuCategoryPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["updateMenuCategory"],
      mutationFn: async (payload: UpdateMenuCategoryPayloadType) => {
        const response = await axios.post(
          `${menuCategory_URL}/edit`,
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

export const deleteMenuCategory = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      number,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["deleteMenuCategory"],
      mutationFn: async (id: number) => {
        const response = await axios.post(
          `${menuCategory_URL}/${id}/delete`
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


