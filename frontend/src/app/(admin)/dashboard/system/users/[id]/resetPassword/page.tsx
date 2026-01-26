"use client";
import { Button } from "@/components/button";
import { ErrorScreen } from "@/components/error";
import { Heading } from "@/components/heading";
import { LoadingScreen } from "@/components/loading";
import { useUser } from "@/hooks/useUsers";
import paths from "@/router/path";
import UserNewEditForm from "@/sections/form/UserNewEditForm";
import { UserResetPasswordForm } from "@/sections/form/userPasswordForm";
import { isValidObjectId } from "@/utils/validate";
import { useParams } from "next/navigation";

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
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Reset Password</Heading>
        <div className="flex gap-4">
          <Button href={paths.dashboard.system.users.list} plain>
            Back
          </Button>
        </div>
      </div>
      <UserResetPasswordForm currentData={data} />
    </div>
  );
}
