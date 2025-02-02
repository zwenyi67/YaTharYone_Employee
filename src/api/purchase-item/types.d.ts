import { TimeStamps } from "@/shared/types";

export interface GetItemType {
  id: string| number;
  name: string;
  unit_of_measure: string;
}

export interface GetPurchaseType extends TimeStamps {
  id: number;
  supplier_id: string | number;
  purchase_date: date | string;
  total_amount: number;
  purchase_note: string;
  purchase_details: PurchaseDetailsType[];
  supplier: SupplierType;

}

export interface SupplierType {
  id: string | number;
  name: string;
  profile: string;
}

export interface PurchaseDetailsType {
  id: string | number;
  item_id: string | number;
  quantity: number;
  total_cost: number;
  item : ItemType; 
}

export interface ItemType {
  id: string | number;
  name: string;
  unit_of_measure: string;
}

export interface AddPurchaseItemPayloadType {
  item_id: number | string;
  item_name: string;
  unit_of_measure: string;
  item_category_id: number | string;
  total_cost: number | any;
  quantity: number | any;
}

export interface ConfirmPurchaseItemsPayloadType {
  purchase_items: AddPurchaseItemPayloadType[];
  supplier_id: number | string;
  total_amount: number;
  purchase_note: string;
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


