import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/utils/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/contexts/toast-context";
import { useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { HOST_SOCKET } from "@/config-global";
import { usePermission } from "./usePermission";

export enum DeliveryMethod {
  NONE = "none",
  STANDARD = "standard",
  EXPRESS = "express",
}

export const deliveryMethods = [
  {
    id: DeliveryMethod.NONE,
    title: "None Delivery",
    turnaround: "customer will pick up",
    price: 0,
  },
  {
    id: DeliveryMethod.STANDARD,
    title: "Standard",
    turnaround: "3–5 business days",
    price: 20000,
  },
  {
    id: DeliveryMethod.EXPRESS,
    title: "Express",
    turnaround: "1-2 business days",
    price: 30000,
  },
];

export enum OrderStatus {
  All = "all",
  CANCELLED = "cancelled",
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  EXPORTED = "exported",
  COMPLETED = "completed",
  OVER_DUE = "overdue",
}

export enum StatusColor {
  CANCELLED = "red",
  PENDING = "yellow",
  CONFIRMED = "blue",
  PROCESSING = "indigo",
  SHIPPED = "purple",
  DELIVERED = "teal",
  EXPORTED = "cyan",
  COMPLETED = "green",
  OVER_DUE = "orange",
}

export enum PaymentMethod {
  CASH = "cash",
  CREDIT_CARD = "credit-card",
  ETRANSFER = "etransfer",
  QR_CODE = "qrCode",
}

export enum PaymentStatus {
  PAID = "paid",
  UNPAID = "unpaid",
}

export interface Item {
  _id?: string;
  product: string;
  productName: string;
  imageSrc: string;
  quantity: number;
  price: number;
  status: OrderStatus;
  //
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  //
}

export enum OrderType {
  WEBSITE = "website",
  IN_STORE = "in-store",
  DELIVERY = "delivery",
}

export enum OrderExport {
  QUICK = "quick",
  NORMAL = "normal",
}

export const paymentMethods = [
  { id: PaymentMethod.CASH, title: "Cash" },
  { id: PaymentMethod.ETRANSFER, title: "eTransfer" },
  { id: PaymentMethod.QR_CODE, title: "QR Code" },
];

export interface Order {
  _id?: string; //uuidv7()
  trackingNumber?: string;
  orderType: OrderType;
  // customer info
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  // status
  status: OrderStatus;
  notes?: string;
  // // timestamps
  createdAt?: string;
  updatedAt?: string;
  items: Item[];
  // payment method
  paymentMethod: PaymentMethod;
  customerPay?: number;
  customerPayCod?: number;
  paymentStatus: PaymentStatus;
  paymentCardNumber?: string;
  paymentCode?: string;
  orderExport: OrderExport;
  taxes: number;
  discount: number;
  subTotal?: number;
  totalAmount?: number;
  // delivery info
  deliveryMethod: DeliveryMethod;
  deliveryPrice: number;

  // // shipping address
  province?: string;
  ward?: string;
  address?: string;
}

// export interface DeliveryOrderDto extends Order {
//   // // shipping address
//   province?: string;
//   ward?: string;
//   address?: string;
// }

export interface InStoreOrderDto extends Order {}
export interface WebsiteOrderDto extends Order {
  // // shipping address
  province: string;
  ward: string;
  address: string;
}
export interface CreateOrderDto extends Omit<
  Order,
  "_id" | "trackingNumber" | "createdAt" | "updatedAt"
> {}

export interface UpdateOrderDto extends Partial<CreateOrderDto> {}

// Query Keys
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters?: { date?: string }) =>
    [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  createdAt: (date: string, byStatus: string) =>
    [...orderKeys.all, "createdAt", date, byStatus] as const,
  week: (weekStart: string) => [...orderKeys.all, "week", weekStart] as const,
  byPhone: (phone: string) => [...orderKeys.all, "phone", phone] as const,
};

// Query Hooks
export function useOrders() {
  return useQuery({
    queryKey: orderKeys.lists(),
    queryFn: async (): Promise<Order[]> => {
      const response = await axiosInstance.get("/orders");
      return response.data;
    },
  });
}

interface OrderEvent {
  event: string;
  data: any;
  timestamp: string;
}

interface UseOrderSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  events: OrderEvent[];
  clearEvents: () => void;
}

export const useOrderSocket = (
  serverUrl = HOST_SOCKET,
): UseOrderSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [events, setEvents] = useState<OrderEvent[]>([]);

  const addEvent = useCallback(
    (event: string, data: any, timestamp: string) => {
      console.log("Adding event:", { event, data, timestamp });
      setEvents((prev) => [{ event, data, timestamp }, ...prev.slice(0, 9999)]); // Keep last 100 events
    },
    [],
  );

  console.log("Order events:", events);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  useEffect(() => {
    const newSocket = io(`${serverUrl}/orders`, {
      transports: ["websocket"],
      autoConnect: true,
    });

    // Connection events
    newSocket.on("connect", () => {
      console.log("🔌 Connected to orders namespace");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("🔌 Disconnected from orders namespace");
      setIsConnected(false);
    });

    newSocket.on("connected", (data) => {
      console.log("👋 Welcome message:", data);
      addEvent("connected", data, new Date().toISOString());
    });

    // Order event listeners
    newSocket.on("order:created", (data) => {
      console.log("✅ Order created:", data);
      addEvent("order:created", data.data, data.timestamp);
    });

    newSocket.on("order:updated", (data) => {
      console.log("📝 Order updated:", data);
      addEvent("order:updated", data.data, data.timestamp);
    });

    newSocket.on("order:deleted", (data) => {
      console.log("🗑️ Order deleted:", data);
      addEvent("order:deleted", data.data, data.timestamp);
    });

    newSocket.on("order:status-updated", (data) => {
      console.log("🔄 Order status status updated:", data);
      addEvent("order:status-updated", data.data, data.timestamp);
    });

    // Error handling
    newSocket.on("connect_error", (error) => {
      console.error("🔥 Socket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      console.log("🔌 Cleaning up socket connection");
      newSocket.close();
    };
  }, [serverUrl, addEvent]);

  return {
    socket,
    isConnected,
    events,
    clearEvents,
  };
};

// export function useOrdersByCreatedAt(
//   date: string,
//   status: string[],
//   enabled = true,
// ) {
//   const queryClient = useQueryClient();
//   const { events } = useOrderSocket();
//   // Handle real-time order events
//   useEffect(() => {
//     if (events.length === 0) return;

//     const lastEvent = events[0];

//     // Refetch data when reception events occur
//     if (
//       lastEvent.event === "order:created" ||
//       lastEvent.event === "order:updated" ||
//       lastEvent.event === "order:deleted" ||
//       lastEvent.event === "order:status-updated"
//     ) {
//       console.log("🔄 Refetching orders for date:", date);
//       queryClient.invalidateQueries({
//         queryKey: ["useOrdersByCreatedAt", date],
//         // Refetch the data
//       });
//     }
//   }, [events, queryClient]);

//   const query = useQuery({
//     queryKey: orderKeys.createdAt(date, status.join(",")),
//     queryFn: async (): Promise<Order[]> => {
//       const response = await axiosInstance.get(
//         `/orders/createdAt?start=${date}&end=${date}&status=${status.join(",")}`,
//       );
//       return response.data;
//     },
//     enabled: enabled && !!date,
//   });

//   return query;
// }
// export function useOrdersByCreatedAt(
//   date: string,
//   status: string[],
//   enabled = true,
// ) {
//   const queryClient = useQueryClient();
//   const { events } = useOrderSocket();

//   // Handle real-time order events
//   useEffect(() => {
//     if (events.length === 0) return;

//     const lastEvent = events[0];
//     const eventData = lastEvent.data as Order;
//     const queryKey = orderKeys.createdAt(date, status.join(","));

//     // Check if event is for the current date
//     const eventDate = eventData.createdAt?.split("T")[0];
//     if (eventDate !== date) return;

//     if (lastEvent.event === "order:created") {
//       console.log("➕ Adding order to cache:", eventData._id);
//       queryClient.setQueryData<Order[]>(queryKey, (oldData) => {
//         if (!oldData) return [eventData];
//         // Check if order already exists
//         if (oldData.some((order) => order._id === eventData._id))
//           return oldData;
//         return [eventData, ...oldData];
//       });
//     }
//     if (
//       lastEvent.event === "order:updated" ||
//       lastEvent.event === "order:status-updated" ||
//       lastEvent.event === "order:updated"
//     ) {
//       console.log("✏️ Updating order in cache:", eventData._id);
//       queryClient.setQueryData<Order[]>(queryKey, (oldData) => {
//         if (!oldData) return [eventData];
//         return oldData.map((order) =>
//           order._id === eventData._id ? eventData : order,
//         );
//       });
//       // Also update detail cache
//       queryClient.setQueryData(
//         orderKeys.detail(eventData._id as string),
//         eventData,
//       );
//     }

//     console.log("✏️ Updating order in cache:", eventData._id);
//     queryClient.setQueryData<Order[]>(queryKey, (oldData) => {
//       if (!oldData) return [eventData];
//       return oldData.map((order) =>
//         order._id === eventData._id ? eventData : order,
//       );
//     });
//     // Also update detail cache
//     queryClient.setQueryData(
//       orderKeys.detail(eventData._id as string),
//       eventData,
//     );

//     if (lastEvent.event === "order:deleted") {
//       console.log("🗑️ Removing order from cache:", eventData._id);
//       queryClient.setQueryData<Order[]>(queryKey, (oldData) => {
//         if (!oldData) return [];
//         return oldData.filter((order) => order._id !== eventData._id);
//       });
//       // Remove detail cache
//       queryClient.removeQueries({
//         queryKey: orderKeys.detail(eventData._id as string),
//       });
//     }
//   }, [events, queryClient, date, status]);

//   const query = useQuery({
//     queryKey: orderKeys.createdAt(date, status.join(",")),
//     queryFn: async (): Promise<Order[]> => {
//       const response = await axiosInstance.get(
//         `/orders/createdAt?start=${date}&end=${date}&status=${status.join(",")}`,
//       );
//       return response.data;
//     },
//     enabled: enabled && !!date,
//   });

//   return query;
// }

export function useOrdersByWeek(weekStart: string, enabled = true) {
  return useQuery({
    queryKey: orderKeys.week(weekStart),
    queryFn: async (): Promise<Order[]> => {
      const response = await axiosInstance.get(`/orders/week/${weekStart}`);
      return response.data;
    },
    enabled: enabled && !!weekStart,
  });
}

export function useOrdersByPhone(phone: string, enabled = true) {
  return useQuery({
    queryKey: orderKeys.byPhone(phone),
    queryFn: async (): Promise<Order[]> => {
      const response = await axiosInstance.get(`/orders/phone/${phone}`);
      return response.data;
    },
    enabled: enabled && !!phone,
  });
}

export function useOrder(id: string, enabled = true) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async (): Promise<Order | WebsiteOrderDto> => {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data;
    },
    enabled: enabled && !!id,
  });
}

// Mutation Hooks
export function useCreateOrder(type: "day" | "week" | "month" = "day") {
  const queryClient = useQueryClient();
  const { error } = useToast();

  return useMutation({
    mutationFn: async (data: CreateOrderDto): Promise<Order> => {
      const response = await axiosInstance.post("/orders", data);
      return response.data;
    },
    onSuccess: (newOrder) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });

      if (type === "day") {
        queryClient.setQueryData(
          orderKeys.detail(newOrder?._id as string),
          newOrder,
        );
      }
      queryClient.invalidateQueries({
        queryKey: orderKeys.createdAt(
          newOrder.createdAt?.split("T")[0] as string,
          "",
        ),
      });
    },
    onError: (err: any) => {
      // check err.message is array
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
}

export function useUpdateOrder(type: "day" | "week" | "month" = "day") {
  const queryClient = useQueryClient();
  const { error } = useToast();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrderDto;
    }): Promise<Order> => {
      const response = await axiosInstance.patch(`/orders/${id}`, data);
      return response.data;
    },
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      if (type === "day") {
        queryClient.setQueryData(
          orderKeys.detail(updatedOrder?._id as string),
          updatedOrder,
        );
      }
      // queryClient.invalidateQueries({
      //   queryKey: orderKeys.createdAt(
      //     updatedOrder.createdAt?.split("T")[0] as string,
      //   ),
      // });
      queryClient.setQueryData(
        orderKeys.detail(updatedOrder._id as string),
        updatedOrder,
      );
    },
    onError: (err: any) => {
      // check err.message is array
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const { error } = useToast();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await axiosInstance.delete(`/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (err: any) => {
      // check err.message is array
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
}
// actions
// useCompleteOrder
export function useOrderUpdateStatus(
  status: OrderStatus,
  action: "submit" | "cancel",
  statusArray: OrderStatus[],
) {
  const queryClient = useQueryClient();
  const { error } = useToast();
  const { hasPermission } = usePermission();

  if (action === "submit" && !hasPermission("orders", "orders:" + status)) {
    return undefined;
  }
 
  if (action === "cancel" && !hasPermission("orders", "orders:cancelled")) {
    return undefined;
  }

  return useMutation({
    mutationFn: async (id: string): Promise<Order> => {
      const endpoint =
        action === "submit"
          ? `/orders/${id}/${status}`
          : `/orders/cancel/${id}/${status}`;
      const response = await axiosInstance.patch(endpoint);
      return response.data;
    },
    onSuccess: (updatedOrder) => {
      const date = updatedOrder.createdAt?.split("T")[0] as string;
      // Refresh order list
      queryClient.invalidateQueries({
        queryKey: orderKeys.createdAt(date, statusArray.join(",")),
      });
      // Also update detail cache
      queryClient.setQueryData(
        orderKeys.detail(updatedOrder._id as string),
        updatedOrder,
      );
      // update createdAt cache
      // refresh day cache (status filters)
      // if (updatedOrder.createdAt) {
      //   queryClient.invalidateQueries({
      //     queryKey: orderKeys.createdAt(
      //       updatedOrder.createdAt.split("T")[0],
      //       ExportStatusOptions.join(","),
      //     ),
      //   });
      // }
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
}

export function useOrderList({
  statusOptions,
  defaultStatus,
}: {
  statusOptions: OrderStatus[];
  defaultStatus: OrderStatus;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { events } = useOrderSocket();

  // search param  date
  const selectedDate =
    useSearchParams().get("date") || new Date().toISOString().split("T")[0];
  const setSelectedDate = (date: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("date", date);
    router.replace(`${window.location.pathname}?${searchParams.toString()}`);
  };

  // search param status
  const currentStatus = useSearchParams().get("status") || defaultStatus;
  const setCurrentStatus = (status: string) => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("status", status);
    router.replace(`${window.location.pathname}?${searchParams.toString()}`);
  };

  // Handle real-time order events
  useEffect(() => {
    if (events.length === 0) return;
    const lastEvent = events[0];
    const eventData = lastEvent.data as Order;
    const queryKey = orderKeys.createdAt(selectedDate, statusOptions.join(","));

    // Check if event is for the current date
    const eventDate = eventData.createdAt?.split("T")[0];
    if (eventDate !== selectedDate) return;
    if (lastEvent.event === "order:created") {
      queryClient.setQueryData<Order[]>(queryKey, (oldData) => {
        if (!oldData) return [eventData];
        // Check if order already exists
        if (oldData.some((order) => order._id === eventData._id))
          return oldData;
        return [eventData, ...oldData];
      });
    }
    if (
      lastEvent.event === "order:updated" ||
      lastEvent.event === "order:status-updated" ||
      lastEvent.event === "order:updated"
    ) {
      console.log("✏️ Updating order in cache:", eventData._id);
      queryClient.setQueryData<Order[]>(queryKey, (oldData) => {
        if (!oldData) return [eventData];
        return oldData.map((order) =>
          order._id === eventData._id ? eventData : order,
        );
      });
      // Also update detail cache
      queryClient.setQueryData(
        orderKeys.detail(eventData._id as string),
        eventData,
      );
    }

    queryClient.setQueryData<Order[]>(queryKey, (oldData) => {
      if (!oldData) return [eventData];
      return oldData.map((order) =>
        order._id === eventData._id ? eventData : order,
      );
    });
    // Also update detail cache
    queryClient.setQueryData(
      orderKeys.detail(eventData._id as string),
      eventData,
    );

    if (lastEvent.event === "order:deleted") {
      console.log("🗑️ Removing order from cache:", eventData._id);
      queryClient.setQueryData<Order[]>(queryKey, (oldData) => {
        if (!oldData) return [];
        return oldData.filter((order) => order._id !== eventData._id);
      });
      // Remove detail cache
      queryClient.removeQueries({
        queryKey: orderKeys.detail(eventData._id as string),
      });
    }
  }, [events, queryClient, selectedDate, status]);

  const query = useQuery({
    queryKey: orderKeys.createdAt(selectedDate, statusOptions.join(",")),
    queryFn: async (): Promise<Order[]> => {
      const response = await axiosInstance.get(
        `/orders/createdAt?start=${selectedDate}&end=${selectedDate}&status=${statusOptions.join(",")}`,
      );
      return response.data;
    },
    enabled: Boolean(selectedDate),
  });

  //const { data } = useOrdersByCreatedAt(selectedDate, statusOptions);
  const data = query.data || [];

  const dataFiltered =
    currentStatus === "all"
      ? data
      : data?.filter((order) => order.status === currentStatus);

  return {
    query,
    router,
    selectedDate,
    setSelectedDate,
    currentStatus,
    setCurrentStatus,
    dataFiltered,
  };
}

export const ConfirmStatusOptions = [
  OrderStatus.All,
  OrderStatus.CANCELLED,
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.EXPORTED,
  OrderStatus.DELIVERED,
  OrderStatus.COMPLETED,
];

export const ExportStatusOptions = [
  OrderStatus.All,
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.EXPORTED,
  OrderStatus.DELIVERED,
  OrderStatus.COMPLETED,
];

export const DeliveryStatusOptions = [
  OrderStatus.All,
  OrderStatus.EXPORTED,
  OrderStatus.DELIVERED,
  OrderStatus.COMPLETED,
];

export const CompleteStatusOptions = [
  OrderStatus.All,
  OrderStatus.CANCELLED,
  OrderStatus.CONFIRMED,
  OrderStatus.EXPORTED,
  OrderStatus.DELIVERED,
  OrderStatus.COMPLETED,
];
