import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import {
  AddEmployeePayloadType,
  GetTablesType,
  PostResponse,
  UpdateEmployeePayloadType,
} from "./types";

const table_URL = "/admin/tables";

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

export const addEmployee = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      AddEmployeePayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["addEmployee"],
      mutationFn: async (payload: AddEmployeePayloadType) => {
        const response = await axios.post(
          `${table_URL}/create`,
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

export const updateEmployee = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      UpdateEmployeePayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["updateEmployee"],
      mutationFn: async (payload: UpdateEmployeePayloadType) => {
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

export const deleteEmployee = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      number,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["deleteEmployee"],
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


