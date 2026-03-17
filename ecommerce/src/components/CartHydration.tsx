"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

export function CartHydration() {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);

  return null;
}
