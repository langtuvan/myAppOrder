"use client";
import { useCartStore } from "@/store/cart";
import { useMemo } from "react";

export default function Count() {
  const items = useCartStore((s) => s.items);
  const count = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items]
  );

  return count || 0;
}
