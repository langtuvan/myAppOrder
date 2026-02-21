"use client";
import { Button } from "@/components/button";
import { AddBtn, Header } from "@/components/header";
import { Heading } from "@/components/heading";
import { useProducts } from "@/hooks/useProducts";
import formattedMessage from "@/language/language";
import paths from "@/router/path";
import ProductList from "@/sections/list/product-list";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function ProductPage() {
  const { data, isLoading } = useProducts();

  return (
    <>
      <Header
        title={formattedMessage.inventory.products.list}
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
