import { TimeStamps } from "@/shared/types";


export interface GetMenuCategoriesType extends TimeStamps {
  id: number;
  name: string;
  description: string;
}

export interface AddMenuCategoryPayloadType {
  name: string;
  description: string;
  createby?: number;
}

export interface UpdateMenuCategoryPayloadType {
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


