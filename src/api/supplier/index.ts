import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import axios from "axios";
import {
  AddSupplierPayloadType,
  GetSuppliersType,
  PostResponse,
  UpdateSupplierPayloadType,
} from "./types";

const supplier_URL = "/admin/suppliers";

export const getSuppliers = {
  useQuery: (opt?: UseQueryOptions<GetSuppliersType[], Error>) =>
    useQuery<GetSuppliersType[], Error>({
      queryKey: ["getSuppliers"],
      queryFn: async () => {
        const response = await axios.get(`${supplier_URL}`);

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

export const addSupplier = {
  useMutation: (
    opt?: UseMutationOptions<
      PostResponse,
      Error,
      AddSupplierPayloadType,
      unknown
    >
  ) => {
    return useMutation({
      mutationKey: ["addSupplier"],
      mutationFn: async (payload: AddSupplierPayloadType) => {
        const response = await axios.post(
          `${supplier_URL}/create`,
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
          `${supplier_URL}/edit`,
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
          `${supplier_URL}/${id}/delete`
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


