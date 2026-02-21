"use client";
import { Header, AddBtn } from "@/components/header";
import { useCategories } from "@/hooks/useCategories";
import CategoryList from "@/sections/list/category-list";
import paths from "@/router/path";
import formattedMessage from "@/language/language";

export default function CategoryPage() {
  const { data, isLoading } = useCategories();
  return (
    <>
      <Header
        title={formattedMessage.inventory.categories.list}
        action={<AddBtn href={paths.dashboard.inventory.categories.create} />}
      />
      <CategoryList
        data={data || []}
        isLoading={isLoading}
        visibilityState={{
          name: true,
          description: true,
          isActive: true,
        }}
      />
    </>
  );
}
