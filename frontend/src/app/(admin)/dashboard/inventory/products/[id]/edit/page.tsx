"use client";
import { ErrorScreen } from "@/components/error";
import { LoadingScreen } from "@/components/loading";
import { useProduct } from "@/hooks/useProducts";
import ProductNewEditForm from "@/sections/form/ProductNewEditForm";
import { useParams } from "next/navigation";

export default function ProductPage() {
  //check if editing or creating and get id
  const id = useParams<{ id: string }>().id;
  // if editing, fetch data
  const { data, isLoading, error, refetch } = useProduct(id);
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error as any} refetch={refetch} />;
  }
  return <ProductNewEditForm currentData={data} />;
}
