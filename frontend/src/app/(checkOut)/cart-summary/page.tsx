"use client";
import { LoadingScreen } from "@/components/loading";
import dynamic from "next/dynamic";

const CartSummary = dynamic(() => import("../../../components/CartSummary"), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function CartPage() {
  return <CartSummary />;
}
