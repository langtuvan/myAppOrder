"use client";
import { CompleteStatusOptions, OrderStatus, useOrder, type Order } from "@/hooks/useOrders";
import OrderActionForm from "@/sections/form/order/orderActionForm";
import { useParams } from "next/navigation";

export default function OrderPage() {
  //check if editing or creating and get id
  const id = useParams<{ id: string }>().id;
  const { data } = useOrder(id);

  return (
    <OrderActionForm
      currentData={data}
      submitStatus={OrderStatus.COMPLETED}
      cancelStatus={OrderStatus.DELIVERED}
      statusArray={CompleteStatusOptions}
    />
  );
}
