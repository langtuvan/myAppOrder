"use client";
import { useWarehouses } from "@/hooks/useWarehouses";
import paths from "@/router/path";
import WarehousesList from "@/sections/list/warehouses-list";
import { useDictionary } from "@/dictionaries/locale";
import { AddBtn, Header } from "@/components/header";

export default function WarehousesPage() {
  const formattedMessage = useDictionary();
  const { data, isLoading } = useWarehouses();
  return (
    <>
      <Header
        title={formattedMessage.admin.inventory.warehouses.list}
        action={<AddBtn href={paths.dashboard.inventory.warehouses.create} />}
      />
      <WarehousesList
        data={data || []}
        isLoading={isLoading}
        visibilityState={{
          name: true,
          location: true,
          isActive: true,
        }}
      />
    </>
  );
}
