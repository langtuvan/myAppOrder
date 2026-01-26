"use client";
import { HOST_API } from "@/config-global";
import { useAuth, usePermission } from "@/hooks";

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

// export default async function OrdersLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const []: [] = await Promise.all([
//     fetch(HOST_API + "/products", {
//       method: "GET",
//       next: { tags: ["products"] },
//     }).then((res) => res.json()),
//     fetch(HOST_API + "/categories", {
//       method: "GET",
//       next: { tags: ["categories"] },
//     }).then((res) => res.json()),
//   ]);
//   return <>{children}</>;
// }
