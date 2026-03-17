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

// Query Keys
export const warehouseKeys = {
  all: ["warehouses"] as const,
  lists: () => [...warehouseKeys.all, "list"] as const,
  details: () => [...warehouseKeys.all, "detail"] as const,
  detail: (id: string) => [...warehouseKeys.details(), id] as const,
};

// Get all warehouses
export const useWarehouses = () => {
  return useQuery({
    queryKey: warehouseKeys.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.warehouses.list);
      return response.data as Warehouse[];
    },
  });
};

// Get single warehouse
export const useWarehouse = (id: string, enabled = true) => {
  return useQuery({
    queryKey: warehouseKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(
        endpoints.warehouses.details(id),
      );
      return response.data as Warehouse;
    },
    enabled: enabled && !!id,
  });
};

// Create warehouse
export const useCreateWarehouse = () => {
  const { canCreateWarehouses } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  if (!canCreateWarehouses()) return undefined;
  return useMutation({
    mutationFn: async (data: CreateWarehouseDto) => {
      const response = await axiosInstance.post(
        endpoints.warehouses.create,
        data,
      );
      success(
        "Created New Warehouse",
        "The warehouse has been created successfully.",
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};

// Update warehouse
export const useUpdateWarehouse = () => {
  const { canEditWarehouses } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  if (!canEditWarehouses()) return undefined;

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateWarehouseDto;
    }) => {
      const response = await axiosInstance.patch(
        endpoints.warehouses.update(id),
        data,
      );
      success(
        "Updated Warehouse",
        "The warehouse has been updated successfully.",
      );
      return response.data as Warehouse;
    },
    onSuccess: (updatedWarehouse) => {
      queryClient.setQueryData(
        warehouseKeys.detail(updatedWarehouse?._id as string),
        updatedWarehouse,
      );
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};

// Delete warehouse
export const useDeleteWarehouse = () => {
  const { canDeleteWarehouses } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { confirm } = useToastDialog();

  if (!canDeleteWarehouses()) return undefined;

  return useMutation({
    mutationFn: async (id: string) => {
      const confirmed = await confirm(
        "Confirm Deletion",
        "Are you sure you want to delete this warehouse?",
      );
      if (confirmed === "confirm") {
        const response = await axiosInstance.delete(
          endpoints.warehouses.delete(id),
        );
        success(
          "Deleted Warehouse",
          "The warehouse has been deleted successfully.",
        );
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: warehouseKeys.lists() });
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};
