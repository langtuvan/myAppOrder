"use client";
import { useInventories } from "@/hooks/useInventory";
import InventoryList from "@/sections/list/inventory-list";
import { Header } from "@/components/header";
import formattedMessage from "@/language/language";

export default function InventoryListPage() {
  const { isLoading, data } = useInventories();
  return (
    <>
      <Header title={formattedMessage.inventory.inventory.list} />
      <InventoryList
        data={data || []}
        isLoading={isLoading}
        visibilityState={{
          product: true,
          warehouse: true,
          quantity: true,
        }}
      />
    </>
  );
}
