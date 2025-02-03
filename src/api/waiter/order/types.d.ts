import { TimeStamps } from "@/shared/types";


export interface GetTablesType extends TimeStamps {
  id: number;
  table_no: string;
  capacity: number;
  status: string;
}

export interface GetMenusType extends TimeStamps {
  id: number;
  profile: string;
  name: string;
  price: number;
  description: string;
  category_id: number;
  category: CategoryType;
  status: string;
  inventory_items: InventoryItems[];
  addon_items: AddonItems[];
}

export interface CategoryType {
  id: number;
  name: string;
}

export interface InventoryItems {
  id: number | string;
  name: string;
  unit_of_measure: string;
  quantity: number | string;
}

export interface AddonItems {
  id:  number | string;
  name: string;
  unit_of_measure: string;
  quantity:  number | string;
  additional_price:  number | string;
}

export interface GetMenuCategoriesType extends TimeStamps {
  id: number;
  name: string;
  description: string;
}

export interface AddSupplierPayloadType {
  name: string;
  contact_person: string;
  profile: File;
  phone: string;
  email: string;
  business_type: string;
  address: string;
  createby?: number;
}

export interface UpdateSupplierPayloadType {
  id: string | number ;
  name: string;
  contact_person: string;
  profile: File;
  phone: string;
  email: string;
  business_type: string;
  address: string;
  updateby?: number;
}

export interface DeleteSupplierType {
  id: string | number;
}

export interface GetRolesType {
  id: number;
  name: string;
}

export interface PostResponse {
  data: string
  status: number
  message: string
}


