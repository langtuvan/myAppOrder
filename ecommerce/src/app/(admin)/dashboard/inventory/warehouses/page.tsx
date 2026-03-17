"use client";
import { useWarehouses } from "@/hooks/useWarehouses";
import paths from "@/router/path";
import WarehousesList from "@/sections/list/warehouses-list";
import formattedMessage from "@/language/language";
import { AddBtn, Header } from "@/components/header";

export default function WarehousesPage() {
  const { data, isLoading } = useWarehouses();
  return (
    <>
      <Header
        title={formattedMessage.inventory.warehouses.list}
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
