import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import { GetChefOrdersType, MarkAsReadyPayloadType, PostResponse, StartPreparingPayloadType } from "./types";

const currentOrder_URL = "/chef"

export const currentOrderList = {
  useQuery: (opt?: UseQueryOptions<GetChefOrdersType[], Error>) =>
    useQuery<GetChefOrdersType[], Error>({
      queryKey: ["currentOrderList"],
      queryFn: async () => {
        const response = await axios.get(`${currentOrder_URL}/currentOrderList`);

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

export const startPreparing = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      StartPreparingPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["startPreparing"],
      mutationFn: async (payload: StartPreparingPayloadType) => {
        const response = await axios.post(
          `${currentOrder_URL}/startPreparing`,
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

export const markAsReady = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      MarkAsReadyPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["markAsReady"],
      mutationFn: async (payload: MarkAsReadyPayloadType) => {
        const response = await axios.post(
          `${currentOrder_URL}/markAsReady`,
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



