"use client";
import { useToast } from "@/contexts/toast-context";
import Toast from "./toast";

const ToastContainer = () => {
  const { toasts } = useToast();
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-in slide-in-from-right-full duration-300"
        >
          <Toast toast={toast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
