"use client";
import { Button } from "@/components/button";
import { AddBtn, Header } from "@/components/header";
import { Heading } from "@/components/heading";
import { useProducts } from "@/hooks/useProducts";
import { useDictionary } from "@/dictionaries/locale";
import paths from "@/router/path";
import ProductList from "@/sections/list/product-list";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function ProductPage() {
  const formattedMessage = useDictionary();
  const { data, isLoading } = useProducts();

  return (
    <>
      <Header
        title={formattedMessage.admin.inventory.products.list}
        action={<AddBtn href={paths.dashboard.inventory.products.create} />}
      />
      <ProductList
        data={data || []}
        isLoading={isLoading}
        visibilityState={{
          name: true,
          category: true,
          price: true,
          isActive: true,
        }}
      />
    </>
  );
}
