import { Customer } from "./customer";
import { Warehouse } from "./warehouse";

export interface IssueReceipt {
  _id: string;
  code: string;
  customer: Customer;
  warehouse: Warehouse;
  status: "draft" | "completed" | "cancelled";
  note?: string;
  createdBy: string;
  items: IssueReceiptItem[];
  // delivery
  deliveryNote?: string;
  deliveryDate?: string;
  deliveryPrice?: number;
}

export interface IssueReceiptDto {
  customer?: string;
  warehouse: string;
  note?: string;
  items: CreateIssueReceiptDto[];
  status: "draft" | "completed" | "cancelled";
  // delivery
  deliveryNote?: string;
  deliveryDate?: string;
  deliveryPrice?: number;
}

export interface UpdateIssueReceiptDto extends Partial<IssueReceiptDto> {}

export interface IssueReceiptItem {
  _id?: string;
  goodsReceipt?: string;
  product: { _id: string; name: string };
  warehouse: { _id: string; name: string };
  quantity: number;
  price: number;
}

export interface CreateIssueReceiptDto {
  product: { _id: string; name: string };
  warehouse: { _id: string; name: string };
  quantity: number;
  price: number;
}
