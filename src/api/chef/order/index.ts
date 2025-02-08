import {
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import { GetChefOrdersType } from "./types";

const currentOrder_URL = "/chef/currentOrderList"

export const currentOrderList = {
  useQuery: (opt?: UseQueryOptions<GetChefOrdersType[], Error>) =>
    useQuery<GetChefOrdersType[], Error>({
      queryKey: ["currentOrderList"],
      queryFn: async () => {
        const response = await axios.get(`${currentOrder_URL}`);

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



