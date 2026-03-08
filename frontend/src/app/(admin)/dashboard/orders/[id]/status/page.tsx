"use client";
import { useOrder } from "@/hooks/useOrders";
import OrderNewEditForm from "@/sections/form/OrderNewEditForm";
import { Order } from "@/types/order";
import { useParams, useSearchParams } from "next/navigation";

export default function OrderPage() {
  //check if editing or creating and get id
  const id = useParams<{ id: string }>().id;
  const params = useSearchParams();
  const updateStatus = params.get("updateStatus") === "true";
  // if editing, fetch data
  const { data } = useOrder(id);

  return <OrderNewEditForm currentData={data as Order} />;
}
