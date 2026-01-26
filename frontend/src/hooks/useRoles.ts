import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Role } from "@/types/role";
import axiosInstance, { endpoints } from "@/utils/axios";
import { data } from "motion/react-client";
import { useToast } from "@/contexts/toast-context";
// Query Keys
export const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  //list: (params: UsersQueryParams) => [...roleKeys.lists(), params] as const,
  details: () => [...roleKeys.all, "detail"] as const,
  detail: (id: string) => [...roleKeys.details(), id] as const,
};
// Get all roles
export const useRoles = (filters?: {
  isActive?: boolean;
  deleted?: boolean;
  name?: string;
}) => {
  return useQuery({
    queryKey: [...roleKeys.lists(), filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.isActive !== undefined) {
        params.append("isActive", filters.isActive.toString());
      }
      if (filters?.deleted !== undefined) {
        params.append("deleted", filters.deleted.toString());
      }
      if (filters?.name) {
        params.append("name", filters.name);
      }

      const response = await axiosInstance.get(`/roles?${params.toString()}`);
      return response.data;
    },
  });
};

// get role by id
export const useRole = (id: string) => {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.roles.details(id));
      return response.data;
    },
    enabled: !!id,
  });
};

// update role by id
export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Role>;
    }): Promise<Role> => {
      const response = await axiosInstance.patch(
        endpoints.roles.update(id),
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      success("Role updated successfully");
    },
    onError: () => {
      error("Failed to update role");
    },
  });
};
