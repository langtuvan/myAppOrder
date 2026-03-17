import { Product } from "./product";
import { Warehouse } from "./warehouse";

export interface Inventory {
  _id: string;
  warehouse: Warehouse;
  product: Product;
  quantity: number;
  reservedQuantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  sku?: string;
  batchNumber?: string;
  expiryDate?: Date;
  isActive: boolean;
  notes?: string;
}
