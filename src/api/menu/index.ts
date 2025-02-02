import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import {
  AddMenuPayloadType,
  AddonItemPayloadType,
  GetMenuCategoriesType,
  GetMenusType,
  PostResponse,
  UpdateMenuPayloadType,
} from "./types";

const menu_URL = "/admin/menus";
const menuCategory_URL = "/admin/menu-categories"

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

export const addMenu = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      AddMenuPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["addMenu"],
      mutationFn: async (payload: AddMenuPayloadType) => {
        const response = await axios.post(
          `${menu_URL}/create`,
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

export const updateMenu = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      UpdateMenuPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["updateMenu"],
      mutationFn: async (payload: UpdateMenuPayloadType) => {
        const response = await axios.post(
          `${menu_URL}/edit`,
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

export const deleteMenu = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      number,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["deleteMenu"],
      mutationFn: async (id: number) => {
        const response = await axios.post(
          `${menu_URL}/${id}/delete`
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

export const addonItem = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      AddonItemPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["addonItem"],
      mutationFn: async (payload: AddonItemPayloadType) => {
        const response = await axios.post(
          `${menu_URL}/addonItem`,
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


