"use client";
import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import { useProducts } from "@/hooks/useProducts";
import paths from "@/router/path";
import ProductList from "@/sections/list/product-list";

export default function ProductPage() {
  const { data } = useProducts();

  return (
    <>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Product List</Heading>
        <div className="flex gap-4">
          <Button href={paths.dashboard.inventory.products.create} plain>
            Add New
          </Button>
        </div>
      </div>
      <ProductList data={data || []} />
    </>
  );
}
