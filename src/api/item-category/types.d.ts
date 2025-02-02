import { TimeStamps } from "@/shared/types";


export interface GetItemCategoriesType extends TimeStamps {
  id: number;
  name: string;
  description: string;
}

export interface AddItemCategoryPayloadType {
  name: string;
  description: string;
  createby?: number;
}

export interface UpdateItemCategoryPayloadType {
  id: string | number ;
  name: string;
  description: string;
  updateby?: number;
}

export interface DeleteItemCategoryType {
  id: string | number;
}

export interface PostResponse {
  data: string
  status: number
  message: string
}


