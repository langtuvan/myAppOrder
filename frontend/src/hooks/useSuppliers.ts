import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Warehouse,
  CreateWarehouseDto,
  UpdateWarehouseDto,
} from "@/types/warehouse";
import axiosInstance, { endpoints } from "@/utils/axios";
import { useToast } from "@/contexts/toast-context";
import { useToastDialog } from "./useToastDialog";
import { usePermission } from "./usePermission";
import { CreateSupplierDto, Supplier, UpdateSupplierDto } from "@/types/supplier";

// Query Keys
export const supplierKeys = {
  all: ["suppliers"] as const,
  lists: () => [...supplierKeys.all, "list"] as const,
  details: () => [...supplierKeys.all, "detail"] as const,
  detail: (id: string) => [...supplierKeys.details(), id] as const,
};

// Get all suppliers
export const useSuppliers = () => {
  return useQuery({
    queryKey: supplierKeys.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.suppliers.list);
      return response.data as Supplier[];
    },
  });
};

// Get single supplier
export const useSupplier = (id: string, enabled = true) => {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(
        endpoints.suppliers.details(id),
      );
      return response.data as Supplier;
    },
    enabled: enabled && !!id,
  });
};

// Create supplier
export const useCreateSupplier = () => {
  const { canCreateSuppliers } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  if (!canCreateSuppliers()) return undefined;
  return useMutation({
    mutationFn: async (data: CreateSupplierDto) => {
      const response = await axiosInstance.post(
        endpoints.suppliers.create,
        data,
      );
      success(
        "Created New Supplier",
        "The supplier has been created successfully.",
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};

// Update supplier
export const useUpdateSupplier = () => {
  const { canEditSuppliers } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  if (!canEditSuppliers()) return undefined;

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSupplierDto;
    }) => {
      const response = await axiosInstance.patch(
        endpoints.suppliers.update(id),
        data,
      );
      success(
        "Updated Supplier",
        "The supplier has been updated successfully.",
      );
      return response.data as Supplier;
    },
    onSuccess: (updatedSupplier) => {
      queryClient.setQueryData(
        supplierKeys.detail(updatedSupplier?._id as string),
        updatedSupplier,
      );
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};

// Delete supplier
export const useDeleteSupplier = () => {
  const { canDeleteSuppliers } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { confirm } = useToastDialog();

  if (!canDeleteSuppliers()) return undefined;

  return useMutation({
    mutationFn: async (id: string) => {
      const confirmed = await confirm(
        "Confirm Deletion",
        "Are you sure you want to delete this supplier?",
      );
      if (confirmed === "confirm") {
        const response = await axiosInstance.delete(
          endpoints.suppliers.delete(id),
        );
        success(
          "Deleted Supplier",
          "The supplier has been deleted successfully.",
        );
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};
