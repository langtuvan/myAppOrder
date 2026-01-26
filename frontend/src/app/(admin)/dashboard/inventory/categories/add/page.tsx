import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import paths from "@/router/path";
import CategoryNewEditForm from "@/sections/form/CategoryNewEditForm";

export default function CategoryPage() {
  return (
    <div className="md:max-w-2xl mx-auto space-y-6">
      <div className="flex  flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Add Category</Heading>
        <div className="flex gap-4">
          <Button href={paths.dashboard.inventory.categories.list} plain>
            Back
          </Button>
        </div>
      </div>
      <CategoryNewEditForm />
    </div>
  );
}
