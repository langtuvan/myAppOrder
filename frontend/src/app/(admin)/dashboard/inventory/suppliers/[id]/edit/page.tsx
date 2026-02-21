"use client";
import { ErrorScreen } from "@/components/error";
import { LoadingScreen } from "@/components/loading";
import { useSupplier } from "@/hooks/useSuppliers";
import SupplierNewEditForm from "@/sections/form/SupplierNewEditForm";
import { useParams } from "next/navigation";

export default function SupplierEditPage() {
  //check if editing or creating and get id
  const id = useParams<{ id: string }>().id;
  // if editing, fetch data
  const { data, isLoading, error, refetch } = useSupplier(id);
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error as any} refetch={refetch} />;
  }
  return <SupplierNewEditForm currentData={data} />;
}
