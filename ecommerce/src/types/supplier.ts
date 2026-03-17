export interface Supplier {
  _id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  companyName: string;
  taxId?: string;
  description: string;
  isActive: boolean;
}

export interface CreateSupplierDto {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  companyName?: string;
  taxId?: string;
  description?: string;
  isActive: boolean;
}

export interface UpdateSupplierDto extends Partial<CreateSupplierDto> {}
