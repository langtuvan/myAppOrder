"use client";

import {
  ExportStatusOptions,
  OrderStatus,
  useOrder,
  type Order,
} from "@/hooks/useOrders";
import paths from "@/router/path";
import OrderActionForm from "@/sections/form/order/orderActionForm";

import { useParams } from "next/navigation";

export default function OrderPage() {
  //check if editing or creating and get id
  const id = useParams<{ id: string }>().id;
  const { data } = useOrder(id);

  return (
    <OrderActionForm
      currentData={data}
      submitStatus={OrderStatus.EXPORTED}
      cancelStatus={OrderStatus.CONFIRMED}
      statusArray={ExportStatusOptions}
    />
  );
}
