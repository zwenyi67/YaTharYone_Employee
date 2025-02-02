import { TimeStamps } from "@/shared/types";


export interface GetSuppliersType extends TimeStamps {
  id: number;
  name: string;
  contact_person: string;
  profile: string;
  phone: string;
  email: string;
  business_type: string;
  address: string;
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


