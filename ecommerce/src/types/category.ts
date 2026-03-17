//import { Amenity } from "./amenity";

export enum CategoryType {
  PRODUCT = "PRODUCT",
  SERVICE = "SERVICE",
  COMBO = "COMBO",
}

export interface Category {
  _id: string;
  type: CategoryType;
  name: string;
  description: string;
  images?: string[];
  //tags?: Amenity[];
  //tags?: { [key: string]: string }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto
  extends Omit<Category, "_id" | "createdAt" | "updatedAt" | "tags"> {
  tags?: string[];
  //tags?: { [key: string]: string }[];
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
