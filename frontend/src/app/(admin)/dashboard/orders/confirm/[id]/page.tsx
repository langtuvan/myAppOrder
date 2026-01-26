"use client";
import { OrderStatus, useOrder, ConfirmStatusOptions } from "@/hooks/useOrders";
import paths from "@/router/path";
import OrderActionForm from "@/sections/form/order/orderActionForm";

import { useParams } from "next/navigation";

export default function OrderConfirmPage() {
  //check if editing or creating and get id
  const id = useParams<{ id: string }>().id;
  const { data } = useOrder(id);

  return (
    <OrderActionForm
      currentData={data}
      submitStatus={OrderStatus.CONFIRMED}
      cancelStatus={OrderStatus.PENDING}
      statusArray={ConfirmStatusOptions}
    />
  );
}
