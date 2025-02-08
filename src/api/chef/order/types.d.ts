import { TimeStamps } from "@/shared/types";


export interface GetChefOrdersType extends TimeStamps {
  id: number;
  order_number: string;
  status: string;
  order_details: OrderDetails[];
  table: Table;
}

export interface Table {
  id: number;
  table_no: string
}

export interface OrderDetails extends TimeStamps {
  id: number;
  quantity: number;
  note: string;
  status: string;
  menu: Menu;
}

export interface Menu {
  id: number;
  name: string;
  price: number;
  profile: string;
}

export interface PostResponse {
  data: string
  status: number
  message: string
}


