import { Category } from "./category";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  stock: number;
  isAvailable: boolean;
  imageSrc?: string;
  images?: File[] | string[] | null | any;
  sku?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface CreateProductDto {
  category: string; // Category ID
  name: string;
  description: string;
  images: string[];
  price: number;

  stock: number;
  // // isAvailable?: boolean;
  sku: string;
  isActive: boolean;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string; // Category ID
  stock?: number;
  isAvailable?: boolean;
  images?: string[];
  sku?: string;
}
