import { Customer } from "./customer";

export enum PaymentMethod {
  CASH = "cash",
  CREDIT_CARD = "credit-card",
  ETRANSFER = "etransfer",
  QR_CODE = "qrCode",
}

export const paymentMethods = [
  { id: PaymentMethod.CASH, title: "Cash" },
  { id: PaymentMethod.ETRANSFER, title: "eTransfer" },
  { id: PaymentMethod.QR_CODE, title: "QR Code" },
];

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
  RECEPT = "recept",
}

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

export interface Order {
  _id?: string; //uuidv7()
  trackingNumber?: string;
  orderType: OrderType;
  orderExport: OrderExport;
  items: Item[];
  notes?: string;
  status: OrderStatus;
  // customer info
  customer?: Customer; // customer id
  //billing info
  billing: {
    subTotal: number;
    deliveryPrice: number;
    discount: number;
    totalAmount: number;
    customerPay: number;
    customerPayCod: number;
  };
  // payment method
  payment: {
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    paymentCardNumber?: string;
    paymentCode?: string;
  };
  // delivery info
  delivery?: {
    deliveryMethod?: DeliveryMethod;
    province?: string;
    ward?: string;
    address?: string;
    receiptPhone?: string;
    receiptNote?: string;
    receiptName?: string;
    receiptEmail?: string;
  };
  // user tracking
  createdBy?: string;
  updatedBy?: string;
  checker?: string;
  cashier?: string;
  exporter?: string;
  deliveryBy?: string;
  deliveredAt?: string;
  // timestamps
  createdAt?: string;
  updatedAt?: string;
  //
  exported?: boolean;
}

export interface OrderDto extends Omit<Order, "customer"> {
  customer?: string; // customer id
}

export interface UpdateOrderDto extends Partial<OrderDto> {}
