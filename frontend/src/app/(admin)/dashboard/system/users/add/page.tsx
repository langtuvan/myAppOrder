import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import paths from "@/router/path";
import UserNewEditForm from "@/sections/form/UserNewEditForm";
import UserList from "@/sections/list/user-list";

export default function UserPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex  flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Add User</Heading>
        <div className="flex gap-4">
          <Button href={paths.dashboard.system.users.list} plain>
            Back
          </Button>
        </div>
      </div>
      <UserNewEditForm />
    </div>
  );
}
