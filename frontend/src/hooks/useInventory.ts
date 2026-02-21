import { useQuery } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "@/utils/axios";

import { Inventory } from "@/types/inventory";

// Query Keys
export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: string) => [...inventoryKeys.details(), id] as const,
};

// Get all suppliers
export const useInventories = () => {
  return useQuery({
    queryKey: inventoryKeys.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.inventory.list);
      return response.data as Inventory[];
    },
  });
};

// Get single supplier
export const useInventory = (id: string, enabled = true) => {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.inventory.details(id));
      return response.data as Inventory;
    },
    enabled: enabled && !!id,
  });
};
