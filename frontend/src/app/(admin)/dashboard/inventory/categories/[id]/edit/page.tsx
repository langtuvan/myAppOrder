"use client";
import { ErrorScreen } from "@/components/error";
import { LoadingScreen } from "@/components/loading";
import { useCategory } from "@/hooks/useCategories";
import CategoryNewEditForm from "@/sections/form/CategoryNewEditForm";
import { useParams } from "next/navigation";

export default function CategoryPage() {
  //check if editing or creating and get id
  const id = useParams<{ id: string }>().id;
  // if editing, fetch data
  const { data, isLoading, error, refetch } = useCategory(id);
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error as any} refetch={refetch} />;
  }
  return <CategoryNewEditForm currentData={data} />;
}
