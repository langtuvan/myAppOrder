"use client";
import { useParams } from "next/navigation";
import { ErrorScreen } from "@/components/error";
import { LoadingScreen } from "@/components/loading";
import { useUser } from "@/hooks/useUsers";
import UserNewEditForm from "@/sections/form/UserNewEditForm";

export default function UserPage() {
  //check if editing or creating and get id
  const id = useParams<{ id: string }>().id;
  // if editing, fetch data
  const { data, isLoading, error, refetch } = useUser(id);
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error as any} refetch={refetch} />;
  }
  return <UserNewEditForm currentData={data} />;
}
