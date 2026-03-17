"use client";
import paths from "@/router/path";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function InventoryPage() {
  const router = useRouter();
  useEffect(() => {
    router.push(paths.dashboard.inventory.inventory.list);
  }, []);
  return null;
}
