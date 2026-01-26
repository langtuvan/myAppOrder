"use client";
import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import { useCategories } from "@/hooks/useCategories";
import paths from "@/router/path";
import CategoryList from "@/sections/list/category-list";


export default function CategoryPage() {
  const { data, isLoading } = useCategories();

  return (
    <>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Category List</Heading>
        <div className="flex gap-4">
          <Button href={paths.dashboard.inventory.categories.create} plain>
            Add New
          </Button>
        </div>
      </div>
      <CategoryList data={data || []} />
    </>
  );
}
