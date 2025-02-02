import { TimeStamps } from "@/shared/types";


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

export interface AddonItemType {
  item_id: number | string;
  item_name: string;
  unit_of_measure: string;
  item_category_id: number | string;
  additional_price: number | any;
  quantity: number | any;
}

export interface IngredientType {
  item_id: number | string;
  item_name: string;
  unit_of_measure: string;
  item_category_id: number | string;
  quantity: number | any;
}

export interface GetMenuCategoriesType {
  id: number;
  name: string;
}

export interface CategoryType {
  name: string;
}

export interface AddMenuPayloadType {
  profile: string;
  name: string;
  price: number;
  description: string;
  category_id: number;
  ingredients: IngredientType[];
  createby: number;
}

export interface UpdateMenuPayloadType {
  id: string | number;
  name: string;
  price: number;
  description: string;
  ingredients: IngredientType[];
  updateby?: number;
}

export interface DeleteMenuType {
  id: string | number;
}

export interface PostResponse {
  data: string
  status: number
  message: string
}

export interface AddonItemPayloadType {
  menu_id: string | number;
    addon_items: AddonItems[];
    createby: number;
}

