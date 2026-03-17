"use client";
import { useParams } from "next/navigation";
import { useRole } from "@/hooks/useRoles";
import RoleNewEditForm from "../form/RoleNewEditForm";
import { ErrorScreen } from "@/components/error";
import { LoadingScreen } from "@/components/loading";
import { isValidObjectId } from "@/utils/validate";

export default function UserView() {
  // check if editing or creating and get id
  const id = useParams<{ id: string }>().id;
  const isEditing = isValidObjectId(id);
  // if creating new, show empty form
  if (!isEditing) return <RoleNewEditForm />;
  // if editing, fetch data
  const { data, isLoading, error, refetch } = useRole(
    useParams<{ id: string }>().id
  );
  if (isLoading) {
    return <LoadingScreen />;
  }
  if (error) {
    return <ErrorScreen error={error as any} refetch={refetch} />;
  }

  return <RoleNewEditForm currentData={data} />;
}
