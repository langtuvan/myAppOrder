import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/utils/axios";
import {
  Module,
  CreateModuleDto,
  UpdateModuleDto,
  ModuleStats,
} from "@/types/role";
import { usePermission } from "./usePermission";
import { useToast } from "@/contexts/toast-context";
import { useToastDialog } from "./useToastDialog";




// Get all modules
export const useModules = (filters?: {
  name?: string;
  apiPrefix?: string;
  isActive?: boolean;
}) => {
  // const { canViewModules } = usePermission();
  return useQuery({
    queryKey: ["modules", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.name) {
        params.append("name", filters.name);
      }
      if (filters?.apiPrefix) {
        params.append("apiPrefix", filters.apiPrefix);
      }
      if (filters?.isActive !== undefined) {
        params.append("isActive", String(filters.isActive));
      }

      const response = await axios.get(`/modules?${params.toString()}`);
      return response.data as Module[];
    },
    //enabled: canViewModules(),
  });
};

