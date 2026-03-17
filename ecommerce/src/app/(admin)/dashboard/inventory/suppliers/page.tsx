"use client";
import paths from "@/router/path";
import formattedMessage from "@/language/language";
import SupplierList from "@/sections/list/suppliers-list";
import { useSuppliers } from "@/hooks/useSuppliers";
import { AddBtn, Header } from "@/components/header";

export default function SupplierListPage() {
  const { data, isLoading } = useSuppliers();
  return (
    <>
      <Header
        title={formattedMessage.inventory.suppliers.list}
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
