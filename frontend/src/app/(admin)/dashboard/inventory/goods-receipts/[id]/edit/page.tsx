"use client";
import { ErrorScreen } from "@/components/error";
import { LoadingScreen } from "@/components/loading";
import { useGoodsReceipt } from "@/hooks/useGoodsReceipts";
import GoodsReceiptsNewEditForm from "@/sections/form/GoodsReceiptsNewEditForm";
import { useParams } from "next/navigation";

export default function GoodsReceiptPage() {
  //check if editing or creating and get id
  const id = useParams<{ id: string }>().id;
  // if editing, fetch data
  const { data, isLoading, error, refetch } = useGoodsReceipt(id);
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error as any} refetch={refetch} />;
  }
  return <GoodsReceiptsNewEditForm currentData={data} />;
}
