import { TimeStamps } from "@/shared/types";

export interface GetInventoriesType extends TimeStamps {
  id: number;
  name: string;
  unit_of_measure: string;
  current_stock: number;
  reorder_level: number;
  min_stock_level: number;
  expiry_period_inDay: number;
  item_category_id: number;
  description: string;
  inventory_item_category: InventoryItemCategory
}
export interface InventoryItemCategory {
  id: number;
  name: string;
}

export interface AddInventoryPayloadType {
  name: string;
  unit_of_measure: string;
  current_stock: number;
  reorder_level: number;
  min_stock_level: number;
  expiry_period_inDay: number;
  item_category_id: number | string;
  description: string;
  createby?: number;
}

export interface UpdateInventoryPayloadType {
  id: string | number ;
  name: string;
  unit_of_measure: string;
  current_stock: number;
  reorder_level: number;
  min_stock_level: number;
  expiry_period_inDay: number;
  item_category_id: number | string;
  description: string;
  updateby?: number;
}

export interface DeleteInventoryType {
  id: string | number;
}

export interface GetItemCategoriesType {
  id: number;
  name: string;
}

export interface PostResponse {
  data: string
  status: number
  message: string
}


