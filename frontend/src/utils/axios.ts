import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
// config
import { HOST_API } from "@/config-global";
import { image } from "motion/react-client";

// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    "Content-Type": "application/json",
    "X-Locale": "en", // Set default locale header
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
  withCredentials: true, // Important: Send cookies with every request
  timeout: 30000,
});

// Ensure credentials are sent with every request
axiosInstance.defaults.withCredentials = true;

// Track if we're currently refreshing the token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

//Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    //NProgress.start();

    // const locale = localStorage.getItem("locale") || "vi";
    // const faculty = JSON.parse(localStorage.getItem("currentFaculty") || "{}");

    //config.headers["x-locale"] = locale;
    config.headers["Access-Control-Allow-Origin"] = HOST_API || "*";
    config.headers["Access-Control-Allow-Credentials"] = true;
    config.headers["authorization"] =
      "bearer " + localStorage.getItem("accessToken");
    //config.headers["x-faculty"] = faculty._id || "";
    // header

    return config;
  },
  (error) => {
    //NProgress.done();
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    //NProgress.done();

    return response;
  },
  async (error: AxiosError | any) => {
    //NProgress.done();

    const originalRequest = error.config;

    // Handle 401 Unauthorized errors

    // Handle other errors
    const message = error?.response?.data?.message;
    if (message && typeof message === "string") {
      //useSnackbar.error(message);
    }

    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export const fetcher = (url: string) =>
  axiosInstance.get(url).then((res) => res.data);

export default axiosInstance;

export const endpoints = {
  // Categories
  categories: {
    list: "/categories",
    details: (id: string) => `/categories/${id}`,
    create: "/categories",
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
    // images
    uploadImages: (id: string) => `/categories/${id}/upload-images`,
    deleteImage: (id: string) => `/categories/${id}/delete-image/`,
  },

  // Products
  products: {
    list: "/products",
    details: (id: string) => `/products/${id}`,
    create: "/products",
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    byCategory: (categoryId: string) => `/products?category=${categoryId}`,
    uploadImages: (id: string) => `/products/${id}/upload-images`,
    deleteImage: (id: string) => `/products/${id}/delete-image/`,
  },

  // Product Services
  productServices: {
    publicList: (params?: { product?: string }) => {
      if (params?.product) {
        return `/product-services/public?product=${params.product}`;
      }
      return "/product-services/public";
    },
    list: (params?: { product?: string }) => {
      if (params?.product) {
        return `/product-services?product=${params.product}`;
      }
      return "/product-services";
    },
    details: (id: string) => `/product-services/${id}`,
    create: "/product-services",
    update: (id: string) => `/product-services/${id}`,
    delete: (id: string) => `/product-services/${id}`,
  },

  // Orders
  orders: {
    list: "/orders",
    details: (id: string) => `/orders/${id}`,
    create: "/orders",
    update: (id: string) => `/orders/${id}`,
    delete: (id: string) => `/orders/${id}`,
    updateStatus: (id: string, status: string) => `/orders/${id}/${status}`,
    cancel: (id: string) => `/orders/${id}/cancel`,
  },

  // Items
  items: {
    list: (params?: {
      faculty?: string;
      product?: string;
      status?: string;
      page?: number;
      limit?: number;
    }) => {
      const query = new URLSearchParams();
      if (params?.faculty) query.append("faculty", params.faculty);
      if (params?.product) query.append("product", params.product);
      if (params?.status) query.append("status", params.status);
      if (params?.page) query.append("page", params.page.toString());
      if (params?.limit) query.append("limit", params.limit.toString());
      return `/items${query.toString() ? `?${query.toString()}` : ""}`;
    },
    details: (id: string) => `/items/${id}`,
    create: "/items",
    update: (id: string) => `/items/${id}`,
    delete: (id: string) => `/items/${id}`,
  },

  // Bookings
  bookings: {
    list: "/bookings",
    details: (id: string) => `/bookings/${id}`,
    create: "/bookings",
    update: (id: string) => `/bookings/${id}`,
    delete: (id: string) => `/bookings/${id}`,
    findByCustomerPhone: (phone: string) => `/bookings/customer/${phone}`,
    findByDateAndFaculty: (date: string, facultyId: string) =>
      `/bookings/date/${date}/faculty/${facultyId}`,
  },

  // Users
  users: {
    list: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      role?: string;
      deleted?: boolean;
    }) => {
      const query = new URLSearchParams();
      if (params?.page) query.append("page", params.page.toString());
      if (params?.limit) query.append("limit", params.limit.toString());
      if (params?.search) query.append("search", params.search);
      if (params?.role) query.append("role", params.role);
      if (params?.deleted !== undefined)
        query.append("deleted", params.deleted.toString());

      return `/users${query.toString() ? `?${query.toString()}` : ""}`;
    },
    details: (id: string) => `/users/${id}`,
    create: "/users",
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    restore: (id: string) => `/users/${id}/restore`,
  },

  // Customers
  customers: {
    list: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      deleted?: boolean;
      sortBy?: string;
      sortOrder?: string;
    }) => {
      const query = new URLSearchParams();
      if (params?.page) query.append("page", params.page.toString());
      if (params?.limit) query.append("limit", params.limit.toString());
      if (params?.search) query.append("search", params.search);
      if (params?.status) query.append("status", params.status);
      if (params?.deleted !== undefined)
        query.append("deleted", params.deleted.toString());
      if (params?.sortBy) query.append("sortBy", params.sortBy);
      if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

      return `/customers${query.toString() ? `?${query.toString()}` : ""}`;
    },
    details: (id: string) => `/customers/${id}`,
    findByPhone: (phone: string) => `/customers/by-phone/${phone}`,
    create: "/customers",
    update: (id: string) => `/customers/${id}`,
    delete: (id: string) => `/customers/${id}`,
    restore: (id: string) => `/customers/${id}/restore`,
    stats: "/customers/stats",
  },

  // modules
  modules: {
    list: "/modules",
    details: (id: string) => `/modules/${id}`,
    create: "/modules",
    update: (id: string) => `/modules/${id}`,
    delete: (id: string) => `/modules/${id}`,
  },
  // permissions
  permissions: {
    list: "/permissions",
    details: (id: string) => `/permissions/${id}`,
    create: "/permissions",
    update: (id: string) => `/permissions/${id}`,
    delete: (id: string) => `/permissions/${id}`,
  },

  // Roles
  roles: {
    list: (params?: {
      isActive?: boolean;
      deleted?: boolean;
      name?: string;
    }) => {
      const query = new URLSearchParams();
      if (params?.isActive !== undefined)
        query.append("isActive", params.isActive.toString());
      if (params?.deleted !== undefined)
        query.append("deleted", params.deleted.toString());
      if (params?.name) query.append("name", params.name);
      return `/roles${query.toString() ? `?${query.toString()}` : ""}`;
    },
    details: (id: string) => `/roles/${id}`,
    create: "/roles",
    update: (id: string) => `/roles/${id}`,
    delete: (id: string) => `/roles/${id}`,
    restore: (id: string) => `/roles/${id}/restore`,
    addPermission: (roleId: string, permissionId: string) =>
      `/roles/${roleId}/permissions/${permissionId}`,
    removePermission: (roleId: string, permissionId: string) =>
      `/roles/${roleId}/permissions/${permissionId}`,
  },

  // Faculties
  faculties: {
    list: "/faculties",
    details: (id: string) => `/faculties/${id}`,
    byCode: (code: string) => `/faculties/code/${code}`,
    create: "/faculties",
    update: (id: string) => `/faculties/${id}`,
    delete: (id: string) => `/faculties/${id}`,
    // Room endpoints
    addRoom: (facultyId: string) => `/faculties/${facultyId}/rooms`,
    getRooms: (facultyId: string) => `/faculties/${facultyId}/rooms`,
    getRoom: (facultyId: string, roomIndex: number) =>
      `/faculties/${facultyId}/rooms/${roomIndex}`,
    updateRoom: (facultyId: string, roomIndex: number) =>
      `/faculties/${facultyId}/rooms/${roomIndex}`,
    deleteRoom: (facultyId: string, roomIndex: number) =>
      `/faculties/${facultyId}/rooms/${roomIndex}`,
    getRoomByNumber: (facultyId: string, roomNumber: string) =>
      `/faculties/${facultyId}/rooms-by-number/${roomNumber}`,
    updateRoomByNumber: (facultyId: string, roomNumber: string) =>
      `/faculties/${facultyId}/rooms-by-number/${roomNumber}`,
    deleteRoomByNumber: (facultyId: string, roomNumber: string) =>
      `/faculties/${facultyId}/rooms-by-number/${roomNumber}`,
  },

  rooms: {
    list: "/rooms",
    roomsByFaculty: (facultyId: string) => `/rooms/by-faculty/${facultyId}`,
    details: (id: string) => `/rooms/${id}`,
    create: (facultyId: string) => `/rooms/${facultyId}`,
    update: (facultyId: string, roomId: string) =>
      `/rooms/${facultyId}/${roomId}`,
    delete: (facultyId: string, roomId: string) =>
      `/rooms/${facultyId}/${roomId}`,
  },

  // Amenities
  amenities: {
    list: (params?: {
      limit?: number;
      offset?: number;
      type?: string;
      status?: string;
    }) => {
      const query = new URLSearchParams();
      if (params?.limit) query.append("limit", params.limit.toString());
      if (params?.offset) query.append("offset", params.offset.toString());
      if (params?.type) query.append("type", params.type);
      if (params?.status) query.append("status", params.status);
      return `/amenities${query.toString() ? `?${query.toString()}` : ""}`;
    },
    details: (id: string) => `/amenities/${id}`,
    create: "/amenities",
    update: (id: string) => `/amenities/${id}`,
    updateStatus: (id: string) => `/amenities/${id}/status`,
    delete: (id: string) => `/amenities/${id}`,
    byCode: (code: string) => `/amenities/code/${code}`,
    deleteByCode: (code: string) => `/amenities/code/${code}`,
  },

  // Auth
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
  },
};
