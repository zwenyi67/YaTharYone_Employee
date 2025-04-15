import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import { GetPaymentOrder, PostResponse, ProcessPaymentPayloadType } from "./types";

const cashier_URL = "/cashier"

export const paymentOrder = {
  useQuery: (opt?: UseQueryOptions<GetPaymentOrder[], Error>) =>
    useQuery<GetPaymentOrder[], Error>({
      queryKey: ["paymentOrder"],
      queryFn: async () => {
        const response = await axios.get(`${cashier_URL}/paymentOrder`);

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

export const processPayment = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      ProcessPaymentPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["processPayment"],
      mutationFn: async (payload: ProcessPaymentPayloadType) => {
        const response = await axios.post(
          `${cashier_URL}/processPayment`,
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



