import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  GoodsReceipt,
  CreateGoodsReceiptDto,
  UpdateGoodsReceiptDto,
} from "@/types/goodReceipt";
import axiosInstance, { endpoints } from "@/utils/axios";
import { useToast } from "@/contexts/toast-context";
import { useToastDialog } from "./useToastDialog";
import { usePermission } from "./usePermission";


// Query Keys
export const goodsReceiptKeys = {
  all: ["goodsReceipts"] as const,
  lists: () => [...goodsReceiptKeys.all, "list"] as const,
  details: () => [...goodsReceiptKeys.all, "detail"] as const,
  detail: (id: string) => [...goodsReceiptKeys.details(), id] as const,
};

// Get all goods receipts
export const useGoodsReceipts = () => {
  return useQuery({
    queryKey: goodsReceiptKeys.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.goodsReceipts.list);
      return response.data as GoodsReceipt[];
    },
  });
};

// Get single goods receipt
export const useGoodsReceipt = (id: string, enabled = true) => {
  return useQuery({
    queryKey: goodsReceiptKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(
        endpoints.goodsReceipts.details(id),
      );
      return response.data as GoodsReceipt;
    },
    enabled: enabled && !!id,
  });
};

// Create goods receipt
export const useCreateGoodsReceipt = () => {
  const { canCreateGoodsReceipts } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  if (!canCreateGoodsReceipts()) return undefined;
  return useMutation({
    mutationFn: async (data: CreateGoodsReceiptDto) => {
      const response = await axiosInstance.post(
        endpoints.goodsReceipts.create,
        data,
      );
      success(
        "Created New Goods Receipt",
        "The goods receipt has been created successfully.",
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goodsReceiptKeys.lists() });
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};

// Update goods receipt
export const useUpdateGoodsReceipt = () => {
  const { canEditGoodsReceipts } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  if (!canEditGoodsReceipts()) return undefined;

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateGoodsReceiptDto;
    }) => {
      const response = await axiosInstance.patch(
        endpoints.goodsReceipts.update(id),
        data,
      );
      success(
        "Updated Goods Receipt",
        "The goods receipt has been updated successfully.",
      );
      return response.data as GoodsReceipt;
    },
    onSuccess: (updatedGoodsReceipt) => {
      queryClient.setQueryData(
        goodsReceiptKeys.detail(updatedGoodsReceipt?._id as string),
        updatedGoodsReceipt,
      );
      queryClient.invalidateQueries({ queryKey: goodsReceiptKeys.lists() });
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};

// Delete goods receipt
export const useDeleteGoodsReceipt = () => {
  const { canDeleteGoodsReceipts } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { confirm } = useToastDialog();

  //if (!canDeleteGoodsReceipts()) return undefined;

  return useMutation({
    mutationFn: async (id: string) => {
      const confirmed = await confirm(
        "Confirm Deletion",
        "Are you sure you want to delete this goods receipt?",
      );
      if (confirmed === "confirm") {
        const response = await axiosInstance.delete(
          endpoints.goodsReceipts.delete(id),
        );
        success(
          "Deleted Goods Receipt",
          "The goods receipt has been deleted successfully.",
        );
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: goodsReceiptKeys.lists() });
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};
