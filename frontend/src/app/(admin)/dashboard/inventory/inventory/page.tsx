"use client";
import { useInventories } from "@/hooks/useInventory";
import InventoryList from "@/sections/list/inventory-list";
import { Header } from "@/components/header";
import { useDictionary } from "@/dictionaries/locale";

export default function InventoryListPage() {
  const formattedMessage = useDictionary();
  const { isLoading, data } = useInventories();
  return (
    <>
      <Header title={formattedMessage.admin.inventory.inventory.list} />
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
