import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import {
  ConfirmPurchaseItemsPayloadType,
  GetItemType,
  GetPurchaseType,
  PostResponse,
} from "./types";

const purchase_URL = "/admin/purchases";

export const getPurchases = {
  useQuery: (opt?: UseQueryOptions<GetPurchaseType[], Error>) =>
    useQuery<GetPurchaseType[], Error>({
      queryKey: ["getPurchases"],
      queryFn: async () => {
        const response = await axios.get(`${purchase_URL}`);

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

export const getItems = {
  useQuery: (categoryId: string | null, opt?: UseQueryOptions<GetItemType[], Error>) =>
    useQuery<GetItemType[], Error>({
      queryKey: ["getItems", categoryId], // Pass queryKey
      queryFn: async () => {
        if (!categoryId) throw new Error("Category ID is required");
        const response = await axios.get(
          `${purchase_URL}/itemListbyCategory?categoryId=${categoryId}`
        );

        const { data, status, message } = response.data;

        if (status !== 0) {
          throw new Error(message);
        }

        return data;
      },
      enabled: !!categoryId, // Enable query only if categoryId is provided
      ...opt, // Pass additional options if provided
    }),
};

export const confirmPurchases = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      ConfirmPurchaseItemsPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["confirmPurchases"],
      mutationFn: async (payload: ConfirmPurchaseItemsPayloadType) => {
        const response = await axios.post(
          `${purchase_URL}/confirm`,
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



