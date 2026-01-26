"use client";
import { useOrder, type Order } from "@/hooks/useOrders";
import OrderNewEditForm, { StepType } from "@/sections/form/OrderNewEditForm";
import { useParams } from "next/navigation";

export default function OrderPage() {
  //check if editing or creating and get id
  const id = useParams<{ id: string }>().id;
  // if editing, fetch data
  const { data } = useOrder(id);

  return (
    <OrderNewEditForm currentData={data} defaultStep={StepType.CHECKOUT} />
  );
}
