import { TimeStamps } from "@/shared/types";


export interface GetPaymentOrder extends TimeStamps {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  payment_id: number;
  payment_method: string;
  payment_number: string;
  order_details: OrderDetails[];
  table: Table;
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

export interface Table {
  id: number;
  table_no: string
}





export interface ProcessPaymentPayloadType {
  payment_id: number;
  payment_method: string;
  payment_status: string;
  table_id: number;
  order_id: number;
}

export interface MarkAsReadyPayloadType {
  order_id: number;
  orderDetail_id: number;
  quantity: number;
  status: string;
}



export interface PostResponse {
  data: string
  status: number
  message: string
}


