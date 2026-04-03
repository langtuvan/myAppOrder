"use client";
import paths from "@/router/path";
import { useDictionary } from "@/dictionaries/locale";
import SupplierList from "@/sections/list/suppliers-list";
import { useSuppliers } from "@/hooks/useSuppliers";
import { AddBtn, Header } from "@/components/header";

export default function SupplierListPage() {
  const formattedMessage = useDictionary();
  const { data, isLoading } = useSuppliers();
  return (
    <>
      <Header
        title={formattedMessage.admin.inventory.suppliers.list}
        action={<AddBtn href={paths.dashboard.inventory.suppliers.create} />}
      />
      <SupplierList
        data={data || []}
        isLoading={isLoading}
        visibilityState={{
          name: true,
          address: true,
        }}
      />
    </>
  );
}
