// ==============================
// AUTH TYPES - Booking System
// ==============================

export interface IPermission {
  _id: string;
  resource: string;
  action: string;
  description?: string;
  isActive: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IRole {
  _id: string;
  name: string;
  description?: string;
  permissions: IPermission[];
  isActive: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  _id: string;
  email?: string;
  name: string;
  role: IRole;
  isActive: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IMenuItem {
  id: string;
  module: string;
  label: string;
  path?: string;
  icon: string;
  children?: IMenuItem[];
  permissions?: string[];
}

export interface IAuthState {
  user: IUser | null;
  menu: IMenuItem[];
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IUser;
  menu: IMenuItem[];
  accessToken: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface IAuthContext extends IAuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: IRegisterRequest) => Promise<void>;
  checkAuth: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  //
}

export type AuthAction =
  | {
      type: "INITIALIZE";
      payload: {
        user: IUser | null;
        menu: IMenuItem[];
      };
    }
  | { type: "LOGIN"; payload: { user: IUser; menu: IMenuItem[] } }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: IUser }
  | { type: "SET_LOADING"; payload: boolean };
