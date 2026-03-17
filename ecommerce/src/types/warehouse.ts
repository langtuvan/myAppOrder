export interface Warehouse {
  _id: string;
  name: string;
  location: string;
  description?: string;
  isActive: boolean;
}

export interface CreateWarehouseDto {
    name: string;
    location?: string;
    description?: string;
    isActive?: boolean;
}

export interface UpdateWarehouseDto {
    name?: string;
    location?: string;
    description?: string;
    isActive?: boolean;
}
