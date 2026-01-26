"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "@/utils/axios";
import { CreateUserDto, User } from "@/types/user";
import { useToast } from "@/contexts/toast-context";
import { useToastDialog } from "./useToastDialog";
import { usePermission } from "./usePermission";

// Types for API responses
export interface UsersListResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  deleted?: boolean;
}

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: UsersQueryParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hooks
export function useUsers(params: UsersQueryParams = {}): any {
  const { canViewUsers } = usePermission();

  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async (): Promise<UsersListResponse> => {
      const response = await axiosInstance.get(endpoints.users.list(params));
      return response.data;
    },
    enabled: canViewUsers(),
  });
}

export function useUser(id: string, enabled = true): any {
  const { canViewUsers } = usePermission();
  if (!canViewUsers()) return undefined;
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async (): Promise<User> => {
      const response = await axiosInstance.get(endpoints.users.details(id));
      return response.data;
    },
    enabled: enabled && !!id && canViewUsers(),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  // check permission
  const { canCreateUsers } = usePermission();
  if (!canCreateUsers()) {
    error("You do not have permission to create users.");
    return undefined;
  }

  return useMutation({
    mutationFn: async (data: CreateUserDto) => {
      const response = await axiosInstance.post(endpoints.users.create, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      success("User Created", "The user has been created successfully.");
    },
    onError: (err: any) => {
      // check err.message is array
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An unexpected error occurred.");
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  // check permission
  const { canEditUsers } = usePermission();
  if (!canEditUsers()) {
    error("You do not have permission to edit users.");
    return undefined;
  }

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateUserDto>;
    }) => {
      const response = await axiosInstance.patch(
        endpoints.users.update(id),
        data
      );

      return response.data;
    },
    onSuccess: (updatedUser) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(updatedUser._id), updatedUser);
      success("User Updated", "The user has been updated successfully.");
    },
    onError: (err: any) => {
      // check err.message is array
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An unexpected error occurred.");
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { confirm } = useToastDialog();

  // check permission
  const { canDeleteUsers } = usePermission();
  if (!canDeleteUsers()) {
    error("You do not have permission to delete users.");
    return undefined;
  }

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // Confirm deletion
      const confirmed = await confirm(
        "Confirm Deletion",
        "Are you sure you want to delete this user? This action cannot be undone."
      );
      if (confirmed === "confirm") {
        await axiosInstance.delete(endpoints.users.delete(id));
        success("User Deleted", "The user has been deleted successfully.");
      }
    },
    onSuccess: (data) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (err: any) => {
      // check err.message is array
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An unexpected error occurred.");
    },
  });
}

export function useRestoreUser() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  // check permission
  const { canRestoreUsers } = usePermission();
  if (!canRestoreUsers()) {
    error("You do not have permission to restore users.");
    return undefined;
  }

  return useMutation({
    mutationFn: async (id: string): Promise<User> => {
      const response = await axiosInstance.put(endpoints.users.restore(id));
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      success("User Restored", "The user has been restored successfully.");
    },
    onError: (err: any) => {
      // check err.message is array
      if (Array.isArray(err?.message)) return;
      error(err?.message || "An unexpected error occurred.");
    },
  });
}
