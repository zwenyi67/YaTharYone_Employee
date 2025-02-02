import { TimeStamps } from "@/shared/types";


export interface GetTablesType extends TimeStamps {
  id: number;
  table_no: string;
  capacity: number;
  isOccupied: boolean;
}

export interface AddEmployeePayloadType {
  employee_id: string;
  fullname: string;
  profile: File;
  phone: string;
  email: string;
  gender: string;
  birth_date: string;
  address: string;
  date_hired: string;
  role_id: number;
  createby?: number;
  username: string;
  password: string
}

export interface UpdateEmployeePayloadType {
  id: number;
  employee_id: string;
  fullname: string;
  profile: File;
  phone: string;
  email: string;
  gender: string;
  birth_date: string;
  address: string;
  date_hired: string;
  role_id: number;
  updateby?: number;
  username: string;
  password: string
}

export interface DeleteEmployeeType {
  employee_id: string | number;
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


