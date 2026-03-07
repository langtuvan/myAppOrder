"use client";
import { useOrder } from "@/hooks/useOrders";
import OrderNewEditForm from "@/sections/form/OrderNewEditForm";
import { Order } from "@/types/order";
import { useParams } from "next/navigation";

export default function OrderPage() {
  //check if editing or creating and get id
  const id = useParams<{ id: string }>().id;
  // if editing, fetch data
  const { data } = useOrder(id);

  console.log("Fetched order data:", data);

  return <OrderNewEditForm currentData={data as Order} />;
}
