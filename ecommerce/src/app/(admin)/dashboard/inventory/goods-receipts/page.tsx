"use client";
import { AddBtn, Header } from "@/components/header";
import { useGoodsReceipts } from "@/hooks/useGoodsReceipts";
import paths from "@/router/path";
import GoodsReceiptsList from "@/sections/list/goodReceipt-list";
import formattedMessage from "@/language/language";

export default function GoodsReceiptsListPage() {
  const { data, isLoading } = useGoodsReceipts();

  return (
    <>
      <Header
        title={formattedMessage.inventory.goodsReceipts.list}
        action={
          <AddBtn href={paths.dashboard.inventory.goodsReceipts.create} />
        }
      ></Header>
      <GoodsReceiptsList
        data={data || []}
        isLoading={isLoading}
        visibilityState={{
          _id: true,
          code: true,
          note: true,
          createdAt: true,
          createdBy: true,
        }}
      />
    </>
  );
}
