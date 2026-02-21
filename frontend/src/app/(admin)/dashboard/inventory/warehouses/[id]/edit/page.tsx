"use client";
import { useParams } from "next/navigation";
import { ErrorScreen } from "@/components/error";
import { LoadingScreen } from "@/components/loading";
import { useWarehouse } from "@/hooks/useWarehouses";
import WarehouseNewEditForm from "@/sections/form/WarehouseNewEditForm";

export default function WarehousePage() {
  //check if editing or creating and get id
  const id = useParams<{ id: string }>().id;
  // if editing, fetch data
  const { data, isLoading, error, refetch } = useWarehouse(id);
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error as any} refetch={refetch} />;
  }
  return <WarehouseNewEditForm currentData={data} />;
}
