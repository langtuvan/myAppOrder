export enum GoodsReceiptStatus {
  DRAFT = "draft",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export type GoodsReceipt = {
  _id: string;
  code?: string;
  supplier?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  status: GoodsReceiptStatus;
  note?: string;
  items: GoodsReceiptItems[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateGoodsReceiptDto = {
  supplier?: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  //status?: GoodsReceiptStatus;
  note?: string;
  items: {
    warehouse: string;
    product: string;
    quantity: number;
    price: number;
  }[];
};

export interface GoodsReceiptItems {
  _id?: string;
  goodsReceipt?: string;
  product: { _id: string; name: string };
  warehouse: { _id: string; name: string };
  quantity: number;
  price: number;
}

export interface GoodsReceiptItemDto {
  product: { _id: string; name: string };
  quantity: number;
  price: number;
  warehouse: { _id: string; name: string };
}

export interface UpdateGoodsReceiptDto extends Partial<CreateGoodsReceiptDto> {}
