import type { FileUploadResponse, LoginPayload, LoginResponse } from "./types"

import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import axios from "axios"

const BASE_URL = "/authorization"

export const loginMutation = {
	useMutation: (
		opt?: UseMutationOptions<LoginResponse, Error, LoginPayload, void>
	) =>
		useMutation({
			mutationKey: ["login"],
			mutationFn: async (payload: LoginPayload) => {
				//console.log("🚀 ~ mutationFn: ~ payload:", payload)
				const response = await axios.post(`${BASE_URL}/login`, payload);

				const { data, status, message } = response.data;

				if (status !== 0) {
					throw new Error(
					  message || "An error occurred while processing the request."
					);
				  }
		  
				  return data;

				// return success now (don't have login api)
				// return {
				// 	token: "fake-token",
				// }
			},
			...opt, // additional options
		}),
}

export const uploadFileDocument = {
	useMutation: (
		opt?: UseMutationOptions<FileUploadResponse, Error, File, void>
	) =>
		useMutation({
			mutationKey: ["uploadFileDocument"],
			mutationFn: async (file: File) => {
				const formData = new FormData()

				const blob = new Blob([file], {
					type: file.type,
				})
				formData.append("file", blob, file.name)

				const response = await axios.post(
					`${BASE_URL}/UploadFileDocument`,
					formData
				)

				if (response.status !== 200) throw new Error()

				return response.data
			},
			throwOnError: true,
			...opt,
		}),
}
