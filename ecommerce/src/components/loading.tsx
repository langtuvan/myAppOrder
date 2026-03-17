"use client";
import { ButtonProps } from "@headlessui/react";
import { Button } from "@/components/button";
import clsx from "clsx";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto" />
      </div>
    </div>
  );
}

export function LoadingButton({
  isSubmitting,
  className,
  color = "blue",
  children,
  ...props
}: {
  isSubmitting: boolean;
  className?: string;
  color?: string;
  children: React.ReactNode;
} & ButtonProps) {
  return (
    <Button
      className={clsx(
        "w-full items-center",
        isSubmitting && "opacity-50 animate-pulse cursor-wait w-full",
        className
      )}
      color={color as any}
      {...props}
    >
      {isSubmitting ? (
        <>
          <div className="animate-spin rounded-full size-5 border-b-2 border-white mr-2" />
          Processing...
        </>
      ) : (
        <>{children}</>
      )}
    </Button>
  );
}
