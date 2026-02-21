"use client";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "@/components/dialog";
import { DialogProps } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Heading } from "./heading";

type ModalFormProps = {
  open?: boolean;
  dialogTitle?: string;
  dialogDescription?: string;
  dialogActions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
};

export function ModalLayout({
  className,
  dialogTitle,
  dialogDescription,
  children,
  dialogActions,
  size = "md",
}: ModalFormProps) {
  const router = useRouter();

  return (
    <Dialog
      open={true}
      onClose={() => {
        console.log("closed");
      }}
      size={size}
      className={className}
    >
      <DialogTitle>
        <div className="flex justify-between items-center">
          {dialogTitle && (
            <Heading className="uppercase">{dialogTitle}</Heading>
          )}
          <Button plain onClick={() => router.back()}>
            <XMarkIcon />
          </Button>
        </div>
      </DialogTitle>
      {dialogDescription && (
        <DialogDescription>{dialogDescription}</DialogDescription>
      )}
      <DialogBody>{children}</DialogBody>
      {dialogActions && <DialogActions>{dialogActions}</DialogActions>}
    </Dialog>
  );
}

export function ModalConfirmLayout({
  dialogTitle,
  dialogDescription,
  children,
  dialogActions,
  size = "sm",
}: ModalFormProps) {
  return (
    <Dialog
      open={true}
      size={size}
      onClose={() => {
        console.log("closed");
      }}
    >
      <DialogTitle className="flex justify-center">
        {dialogTitle && <span>{dialogTitle}</span>}
      </DialogTitle>
      {dialogDescription && (
        <DialogDescription className="flex justify-center">
          {dialogDescription}
        </DialogDescription>
      )}
      <DialogBody>{children}</DialogBody>
      {dialogActions && <DialogActions>{dialogActions}</DialogActions>}
    </Dialog>
  );
}

export function OpenModal({
  open = true,
  dialogTitle,
  dialogDescription,
  children,
  dialogActions,
  onClose,
}: ModalFormProps & { onClose: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        console.log("closed");
      }}
      className="min-w-11/12 w-11/12 overflow-hidden"
    >
      <DialogTitle>
        <div className="flex justify-between">
          {dialogTitle && <span>{dialogTitle}</span>}
          <Button plain onClick={onClose}>
            <XMarkIcon />
          </Button>
        </div>
      </DialogTitle>
      {dialogDescription && (
        <DialogDescription>{dialogDescription}</DialogDescription>
      )}
      <DialogBody>{children}</DialogBody>
      {dialogActions && <DialogActions>{dialogActions}</DialogActions>}
    </Dialog>
  );
}

export function Modal({
  dialogTitle,
  dialogDescription,
  children,
  dialogActions,
  //
  open,
  onClose,
}: ModalFormProps & { open: boolean; onClose: () => void }) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        console.log("closed");
      }}
    >
      <DialogTitle>
        <div className="flex justify-between">
          {dialogTitle && <span>{dialogTitle}</span>}
          <Button plain onClick={onClose}>
            <XMarkIcon />
          </Button>
        </div>
      </DialogTitle>
      {dialogDescription && (
        <DialogDescription>{dialogDescription}</DialogDescription>
      )}
      <DialogBody>{children}</DialogBody>
      {dialogActions && <DialogActions>{dialogActions}</DialogActions>}
    </Dialog>
  );
}
