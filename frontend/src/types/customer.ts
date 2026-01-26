export enum CUSTOMER_GENDER {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export interface Customer {
  _id?: string;
  id: string;
  firstName: string; // required
  lastName?: string;
  phone: string; // required
  status: "active" | "inactive" | "suspended"; // required
  gender: "male" | "female" | "other"; // required
  email?: string;
  company?: string;
  address?: string;
  city?: string;
  province?: string;
  ward?: string;
  zipCode?: string;
  country?: string;

  notes?: string;
  isActive?: boolean;
  deleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerDto
  extends Omit<
    Customer,
    "id" | "createdAt" | "updatedAt" | "deleted" | "isActive"
  > {}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {}

export interface CustomerStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
}

export interface CustomersListResponse {
  data: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CustomersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "suspended";
  sortBy?: "firstName" | "lastName" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
}
