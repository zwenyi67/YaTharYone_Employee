import { TimeStamps } from "@/shared/types";


export interface GetTablesType extends TimeStamps {
  id: number;
  table_no: string;
  capacity: number;
  status: string;
  orders: Order[];
}

export interface Order {
  id: number;
  order_number: string;
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

export interface GetOrdersType {
  id: number;
  name: string;
  price: number;
  note: string;
  quantity: number
}

export interface ProceedOrderPayloadType {
  order_list: GetOrdersType[];
  table_id: number;
  waiter_id: number;
  status: string;
  order_id: number | string | undefined;
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

export interface ServeOrderPayloadType {
  order_id: number;
  orderDetail_id: number;
  quantity: number;
  status: string;
}

export interface RequestBillPayloadType {
  order_id: number;
}

export interface GetPrevOrderType extends TimeStamps {
  id: number;
  order_number: string;
  status: string;
  order_details: OrderDetails[];
  table: Table;
  payment: Payment;
}

export interface Payment extends TimeStamps {
  id: number;
  payment_number: string;
  payment_method: string;
  payment_status: string;
  order_id: number;
  waiter_id: number;
  cashier_id: number;
}


export interface PostResponse {
  data: string
  status: number
  message: string
}


