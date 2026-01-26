"use client";
import { Button } from "@/components/button";
import { ErrorScreen } from "@/components/error";
import { Heading } from "@/components/heading";
import { LoadingScreen } from "@/components/loading";
import { useCategory } from "@/hooks/useCategories";
import { useProduct } from "@/hooks/useProducts";
import paths from "@/router/path";
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
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Edit Product</Heading>
        <div className="flex gap-4">
          <Button href={paths.dashboard.inventory.products.list} plain>
            Back
          </Button>
        </div>
      </div>
      <ProductNewEditForm currentData={data} />
    </div>
  );
}
