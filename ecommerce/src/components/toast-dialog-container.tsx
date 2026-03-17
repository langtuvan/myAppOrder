"use client";
import { useToastDialog } from "@/contexts/toast-dialog-context";
import ToastDialogContent from "./toast-dialog-content";

const ToastDialogContainer = () => {
  const { dialogs } = useToastDialog();

  if (dialogs.length === 0) return null;

  return (
    <>
      {dialogs.map((dialog) => (
        <ToastDialogContent key={dialog.id} dialog={dialog} />
      ))}
    </>
  );
};

export default ToastDialogContainer;
