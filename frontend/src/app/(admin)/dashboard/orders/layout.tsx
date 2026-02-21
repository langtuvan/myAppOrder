"use client";

import {  usePermission } from "@/hooks";

export default function OrdersLayout({
  modal,
  children,
}: {
  modal: React.ReactNode;
  children: React.ReactNode;
}) {
  const { canViewOrders } = usePermission();
  if (!canViewOrders) {
    return <div>You do not have permission to view this page.</div>;
  }
  return (
    <div>
      {children}
      {modal}
      <div id="modal-root" />
    </div>
  );
}

