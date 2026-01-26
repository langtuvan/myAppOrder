export interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  password?: string;
  age?: number;
  gender: "male" | "female" | "other";
  address?: string;
  role: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  isActive: boolean;

  refreshToken?: string;
}

export interface CreateUserDto
  extends Omit<
    User,
    "id" | "_id" | "createdAt" | "updatedAt" | "deleted" | "role"
  > {
  role: string;
}


