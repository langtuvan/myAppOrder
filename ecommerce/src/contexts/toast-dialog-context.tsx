"use client";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type DialogType = "confirm" | "alert" | "info" | "warning" | "error";
export type DialogSize = "sm" | "md" | "lg" | "xl";

export interface DialogAction {
  id: string;
  label: string;
  onClick: () => void | Promise<void>;
  variant?: "default" | "primary" | "danger" | "secondary";
  color?: "white" | "blue" | "red" | "green" | "yellow" | "gray";
  disabled?: boolean;
  loading?: boolean;
}

export interface ToastDialog {
  id: string;
  type: DialogType;
  title: string;
  message?: string;
  description?: string;
  actions?: DialogAction[];
  size?: DialogSize;
  closeButton?: boolean;
  backdropClose?: boolean;
  duration?: number | null;
}

interface ToastDialogContextType {
  dialogs: ToastDialog[];
  showDialog: (dialog: Omit<ToastDialog, "id">) => Promise<string>;
  removeDialog: (id: string) => void;
  updateDialog: (id: string, updates: Partial<ToastDialog>) => void;
  confirm: (
    title: string,
    message?: string,
    options?: Partial<ToastDialog>
  ) => Promise<string>;
  alert: (
    title: string,
    message?: string,
    options?: Partial<ToastDialog>
  ) => Promise<string>;
  info: (
    title: string,
    message?: string,
    options?: Partial<ToastDialog>
  ) => Promise<string>;
  warning: (
    title: string,
    message?: string,
    options?: Partial<ToastDialog>
  ) => Promise<string>;
  error: (
    title: string,
    message?: string,
    options?: Partial<ToastDialog>
  ) => Promise<string>;
}

const ToastDialogContext = createContext<ToastDialogContextType | undefined>(
  undefined
);

export const useToastDialog = () => {
  const context = useContext(ToastDialogContext);

  if (!context) {
    throw new Error("useToastDialog must be used within a ToastDialogProvider");
  }
  return context;
};

interface ToastDialogProviderProps {
  children: ReactNode;
}

export const ToastDialogProvider = ({ children }: ToastDialogProviderProps) => {
  const [dialogs, setDialogs] = useState<ToastDialog[]>([]);

  const showDialog = useCallback(
    (dialog: Omit<ToastDialog, "id">): Promise<string> => {
      return new Promise((resolve) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newDialog: ToastDialog = {
          ...dialog,
          id,
          size: dialog.size || "md",
          closeButton: dialog.closeButton !== false,
          backdropClose: dialog.backdropClose !== false,
          actions: dialog.actions?.map((action) => ({
            ...action,
            onClick: async () => {
              await action.onClick();
              removeDialog(id);
              resolve(action.id);
            },
          })),
        };

        setDialogs((prev) => [...prev, newDialog]);

        // Auto remove dialog after duration if specified
        if (dialog.duration && dialog.duration > 0) {
          setTimeout(() => {
            removeDialog(id);
            resolve("");
          }, dialog.duration);
        }
      });
    },
    []
  );

  const removeDialog = useCallback((id: string) => {
    setDialogs((prev) => prev.filter((dialog) => dialog.id !== id));
  }, []);

  const updateDialog = useCallback(
    (id: string, updates: Partial<ToastDialog>) => {
      setDialogs((prev) =>
        prev.map((dialog) =>
          dialog.id === id ? { ...dialog, ...updates } : dialog
        )
      );
    },
    []
  );

  const confirm = useCallback(
    async (title: string, message?: string, options?: Partial<ToastDialog>) => {
      const defaultActions: DialogAction[] = [
        {
          id: "cancel",
          label: "Cancel",
          color: "white",
          variant: "secondary",
          onClick: () => {},
        },
        {
          id: "confirm",
          label: "Confirm",
          color: "blue",
          variant: "primary",
          onClick: () => {},
        },
      ];

      return showDialog({
        type: "confirm",
        title,
        message,
        actions: options?.actions || defaultActions,
        closeButton: true,
        backdropClose: true,
        ...options,
      });
    },
    [showDialog]
  );

  const alert = useCallback(
    async (title: string, message?: string, options?: Partial<ToastDialog>) => {
      const defaultActions: DialogAction[] = [
        {
          id: "ok",
          label: "OK",
          variant: "primary",
          onClick: () => {},
        },
      ];

      return showDialog({
        type: "alert",
        title,
        message,
        actions: options?.actions || defaultActions,
        closeButton: true,
        backdropClose: false,
        ...options,
      });
    },
    [showDialog]
  );

  const info = useCallback(
    async (title: string, message?: string, options?: Partial<ToastDialog>) => {
      const defaultActions: DialogAction[] = [
        {
          id: "ok",
          label: "OK",
          variant: "primary",
          onClick: () => {},
        },
      ];

      return showDialog({
        type: "info",
        title,
        message,
        actions: options?.actions || defaultActions,
        closeButton: true,
        backdropClose: true,
        ...options,
      });
    },
    [showDialog]
  );

  const warning = useCallback(
    async (title: string, message?: string, options?: Partial<ToastDialog>) => {
      const defaultActions: DialogAction[] = [
        {
          id: "cancel",
          label: "Cancel",
          variant: "secondary",
          onClick: () => {},
        },
        {
          id: "confirm",
          label: "Continue",
          variant: "danger",
          onClick: () => {},
        },
      ];

      return showDialog({
        type: "warning",
        title,
        message,
        actions: options?.actions || defaultActions,
        closeButton: true,
        backdropClose: true,
        ...options,
      });
    },
    [showDialog]
  );

  const error = useCallback(
    async (title: string, message?: string, options?: Partial<ToastDialog>) => {
      const defaultActions: DialogAction[] = [
        {
          id: "ok",
          label: "OK",
          variant: "danger",
          onClick: () => {},
        },
      ];

      return showDialog({
        type: "error",
        title,
        message,
        actions: options?.actions || defaultActions,
        closeButton: true,
        backdropClose: false,
        ...options,
      });
    },
    [showDialog]
  );

  const value = {
    dialogs, // current dialogs
    showDialog,
    removeDialog,
    updateDialog,
    confirm,
    alert,
    info,
    warning,
    error,
  };

  return (
    <ToastDialogContext.Provider value={value}>
      {children}
    </ToastDialogContext.Provider>
  );
};
