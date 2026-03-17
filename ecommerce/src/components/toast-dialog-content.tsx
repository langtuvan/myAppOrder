"use client";
import { useEffect, useState } from "react";
import {
  ToastDialog,
  DialogAction,
  useToastDialog,
} from "@/contexts/toast-dialog-context";
import { Button } from "./button";
import { Text } from "./text";
import { Alert, AlertActions, AlertBody, AlertTitle } from "./alert";
import clsx from "clsx";

interface ToastDialogContentProps {
  dialog: ToastDialog;
}

const ToastDialogContent = ({ dialog }: ToastDialogContentProps) => {
  const { removeDialog } = useToastDialog();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        removeDialog(dialog.id);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, dialog.id, removeDialog]);

  const getTitleStyles = (type: ToastDialog["type"]) => {
    const typeStyles = {
      confirm: "text-blue-900 dark:text-blue-100",
      alert: "text-yellow-900 dark:text-yellow-100",
      info: "text-blue-900 dark:text-blue-100",
      warning: "text-yellow-900 dark:text-yellow-100",
      error: "text-red-900 dark:text-red-100",
    };

    return `text-lg font-semibold ${typeStyles[type]}`;
  };

  const getIconStyles = (type: ToastDialog["type"]) => {
    const iconStyles = {
      confirm: "text-blue-500 dark:text-blue-400",
      alert: "text-yellow-500 dark:text-yellow-400",
      info: "text-blue-500 dark:text-blue-400",
      warning: "text-yellow-500 dark:text-yellow-400",
      error: "text-red-500 dark:text-red-400",
    };

    return `w-6 h-6 ${iconStyles[type]}`;
  };

  const getIcon = (type: ToastDialog["type"]) => {
    switch (type) {
      case "confirm":
        return (
          <svg
            className={getIconStyles(type)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "alert":
        return (
          <svg
            className={getIconStyles(type)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className={getIconStyles(type)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className={getIconStyles(type)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "error":
        return (
          <svg
            className={getIconStyles(type)}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  const handleActionClick = async (action: DialogAction) => {
    try {
      setIsLoading(true);
      await action.onClick();
    } catch (error) {
      console.error("Dialog action error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Alert
        className="text-center"
        open={isOpen}
        onClose={() => console.log("closed")}
      >
        {/* Header */}
        <AlertTitle className="flex items-center justify-center gap-2">
          <div className="flex items-center justify-center gap-3">
            {getIcon(dialog.type)}
            <div className="flex-1">
              <h2 className={getTitleStyles(dialog.type)}>{dialog.title}</h2>
            </div>
          </div>
        </AlertTitle>

        {/* Content */}
        <AlertBody>
          {dialog.message && <Text className=" mb-2">{dialog.message}</Text>}
          {dialog.description && <Text>{dialog.description}</Text>}
        </AlertBody>

        {/* Actions */}
        {dialog.actions && dialog.actions.length > 0 && (
          <AlertActions>
            {dialog.actions.map((action) => (
              <Button
                key={action.id}
                color={action?.color as any || "blue"}
                onClick={() => handleActionClick(action)}
                disabled={isLoading || action.disabled}
                className={clsx(
                  dialog.actions!.length === 2 ? "min-w-1/2" : "min-w-full"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  action.label
                )}
              </Button>
            ))}
          </AlertActions>
        )}
      </Alert>
    </>
  );
};

export default ToastDialogContent;
