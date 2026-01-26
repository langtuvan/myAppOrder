"use client";

import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { createIDBStorage } from "./idbStorage";
import { ECOMMERCE_VARIABLES } from "@/config-global";
import { deliveryMethods, OrderStatus } from "@/hooks/useOrders";

export type CartItem = {
  _id?: string; //uuidv7();
  product: string;
  productName: string;
  imageSrc: string;
  price: number; // in smallest currency unit or decimal; here decimal
  quantity: number;
  //
  status: OrderStatus;
  //
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  // optional metadata for extensibility
  [key: string]: unknown;
};

type CartState = {
  items: CartItem[];
  hasHydrated: boolean;
  subTotal: number;
  deliveryPrice: number;
  baseDeliveryPrice: number; // Store the original delivery price
  taxes: number;
  discount: number;
  totalAmount: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (_id: string) => void;
  updateQuantity: (_id: string, quantity: number) => void;
  clear: () => void;
  setDeliveryPrice: (price: number) => void;
  setTaxes: (amount: number) => void;
  setDiscount: (amount: number) => void;
  // helpers
  getCount: () => number;
  getSubtotal: () => number;
  calculateTotal: () => void;
};

const storage: StateStorage = createIDBStorage("ecommerce2");

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,
      subTotal: 0,
      deliveryPrice: deliveryMethods[1].price,
      baseDeliveryPrice: deliveryMethods[1].price, // Store base price
      taxes: 0,
      discount: 0,
      totalAmount: 0,
      addItem: (item, qty = 1) => {
        const { items } = get();

        // Use product ID as the unique identifier since _id might be undefined
        const existingIndex = items.findIndex(
          (i) => i.product === item.product
        );

        if (existingIndex >= 0) {
          // Item exists, update quantity
          const updated = items.slice();
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: Math.max(1, updated[existingIndex].quantity + qty),
          };
          set({ items: updated });
        } else {
          // New item, add to cart
          set({
            items: [
              ...items,
              { ...item, quantity: Math.max(1, qty) } as CartItem,
            ],
          });
        }
        get().calculateTotal();
      },

      removeItem: (_id) => {
        set({ items: get().items.filter((i) => i._id !== _id) });
        get().calculateTotal();
      },

      updateQuantity: (_id, quantity) => {
        const newQuantity = Math.max(1, quantity);
        set({
          items: get().items.map((i) =>
            i._id === _id ? { ...i, quantity: newQuantity } : i
          ),
        });
        get().calculateTotal();
      },

      clear: () =>
        set({
          items: [],
          subTotal: 0,
          deliveryPrice: deliveryMethods[1].price,
          taxes: 0,
          discount: 0,
          totalAmount: 0,
        }),

      setDeliveryPrice: (price) => {
        set({ baseDeliveryPrice: Math.max(0, price) });
        get().calculateTotal();
      },

      setTaxes: (amount) => {
        set({ taxes: Math.max(0, amount) });
        get().calculateTotal();
      },

      setDiscount: (amount) => {
        set({ discount: Math.max(0, amount) });
        get().calculateTotal();
      },

      getCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),

      calculateTotal: () => {
        const state = get();
        const taxRate = ECOMMERCE_VARIABLES.taxRate; // 8% tax rate (adjust as needed or import from config)
        const subTotal = state.getSubtotal();
        const calculatedTaxes = subTotal * taxRate;

        // Apply free shipping when subtotal exceeds threshold
        const deliveryPrice =
          subTotal >= ECOMMERCE_VARIABLES.freeShippingWhenSubtotalExceeds
            ? 0
            : state.baseDeliveryPrice;

        const totalAmount =
          subTotal + deliveryPrice + calculatedTaxes - state.discount;

        set({
          subTotal,
          deliveryPrice,
          taxes: calculatedTaxes,
          totalAmount: Math.max(0, totalAmount),
        });
      },
    }),
    {
      name: "cart", // key within our prefix
      version: 1,
      storage: createJSONStorage(() => storage),
      partialize: (state) => ({
        items: state.items,
        subTotal: state.subTotal,
        deliveryPrice: state.deliveryPrice,
        baseDeliveryPrice: state.baseDeliveryPrice,
        taxes: state.taxes,
        discount: state.discount,
        totalAmount: state.totalAmount,
      }),
      onRehydrateStorage: () => (state) => {
        // mark hydrated after rehydrate completes
        state?.hasHydrated !== undefined && (state.hasHydrated = true);
      },
    }
  )
);
