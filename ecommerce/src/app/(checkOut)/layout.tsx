"use client";
import { QueryProvider } from "@/providers/query-client-provider";
import { OrderExport, OrderType } from "@/types/order";
import {} from "@/sections/form/OrderNewEditForm";
import { ToastProvider } from "@/contexts/toast-context";
import { ToastDialogProvider } from "@/contexts/toast-dialog-context";
import ToastDialogContainer from "@/components/toast-dialog-container";
import ToastContainer from "@/components/toast-container";

type Props = {
  children: React.ReactNode;
};

export default function Layouta({ children }: Props) {
  return (
    <QueryProvider>
      <ToastDialogProvider>
        <ToastProvider>
          <ToastContainer />
          <ToastDialogContainer />
          {children}
        </ToastProvider>
      </ToastDialogProvider>
    </QueryProvider>
  );
}
