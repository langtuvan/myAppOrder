import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  IssueReceipt,
  CreateIssueReceiptDto,
  UpdateIssueReceiptDto,
} from "@/types/issueReceipt";
import axiosInstance, { endpoints } from "@/utils/axios";
import { useToast } from "@/contexts/toast-context";
import { useToastDialog } from "./useToastDialog";
import { usePermission } from "./usePermission";

// Query Keys
export const issueReceiptKeys = {
  all: ["issueReceipts"] as const,
  lists: () => [...issueReceiptKeys.all, "list"] as const,
  details: () => [...issueReceiptKeys.all, "detail"] as const,
  detail: (id: string) => [...issueReceiptKeys.details(), id] as const,
};

// Get all issue receipts
export const useIssueReceipts = () => {
  return useQuery({
    queryKey: issueReceiptKeys.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.issueReceipts.list);
      return response.data as IssueReceipt[];
    },
  });
};

// Get single issue receipt
export const useIssueReceipt = (id: string, enabled = true) => {
  return useQuery({
    queryKey: issueReceiptKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(
        endpoints.issueReceipts.details(id),
      );
      return response.data as IssueReceipt;
    },
    enabled: enabled && !!id,
  });
};

// Create issue receipt
export const useCreateIssueReceipt = () => {
  const { canCreateIssueReceipts } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  if (!canCreateIssueReceipts()) return undefined;
  return useMutation({
    mutationFn: async (data: CreateIssueReceiptDto) => {
      const response = await axiosInstance.post(
        endpoints.issueReceipts.create,
        data,
      );
      success(
        "Created New Issue Receipt",
        "The issue receipt has been created successfully.",
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueReceiptKeys.lists() });
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};

// Update issue receipt
export const useUpdateIssueReceipt = () => {
  const { canEditIssueReceipts } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  if (!canEditIssueReceipts()) return undefined;

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateIssueReceiptDto;
    }) => {
      const response = await axiosInstance.patch(
        endpoints.issueReceipts.update(id),
        data,
      );
      success(
        "Updated Issue Receipt",
        "The issue receipt has been updated successfully.",
      );
      return response.data as IssueReceipt;
    },
    onSuccess: (updatedIssueReceipt) => {
      queryClient.setQueryData(
        issueReceiptKeys.detail(updatedIssueReceipt?._id as string),
        updatedIssueReceipt,
      );
      queryClient.invalidateQueries({ queryKey: issueReceiptKeys.lists() });
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};

// Delete issue receipt
export const useDeleteIssueReceipt = () => {
  const { canDeleteIssueReceipts } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { confirm } = useToastDialog();

  //if (!canDeleteIssueReceipts()) return undefined;

  return useMutation({
    mutationFn: async (id: string) => {
      const confirmed = await confirm(
        "Confirm Deletion",
        "Are you sure you want to delete this issue receipt?",
      );
      if (confirmed === "confirm") {
        const response = await axiosInstance.delete(
          endpoints.issueReceipts.delete(id),
        );
        success(
          "Deleted Issue Receipt",
          "The issue receipt has been deleted successfully.",
        );
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: issueReceiptKeys.lists() });
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};
