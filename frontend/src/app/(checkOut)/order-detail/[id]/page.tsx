"use client";
import { LoadingScreen } from "@/components/loading";
import OrderDetail from "@/components/OrderDetail";
import { useOrder, WebsiteOrderDto } from "@/hooks/useOrders";
import { useParams } from "next/navigation";

export default function OrderDetailPage() {
  const id = useParams<{ id: string }>().id;
  const { data, isLoading } = useOrder(id);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (data) {
    return <OrderDetail order={data as WebsiteOrderDto} />;
  }
  return null;
}
