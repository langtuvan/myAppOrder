"use client";
import { Header, AddBtn } from "@/components/header";
import { useCategories } from "@/hooks/useCategories";
import CategoryList from "@/sections/list/category-list";
import paths from "@/router/path";
import { useDictionary } from "@/dictionaries/locale";

export default function CategoryPage() {
  const formattedMessage = useDictionary();
  const { data, isLoading } = useCategories();
  return (
    <>
      <Header
        title={formattedMessage.admin.inventory.categories.list}
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
