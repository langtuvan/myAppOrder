import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { endpoints } from "@/utils/axios";
import { isMongoId } from "@/utils/validate";
import { useToast } from "@/contexts/toast-context";
import { useToastDialog } from "./useToastDialog";

import { usePermission } from "./usePermission";




// Get all permissions
export const usePermissions = (filters?: {
  action?: string;
  module?: string;
  method?: string;
  apiPath?: string;
}) => {
  return useQuery({
    queryKey: ["permissions", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.action) {
        params.append("action", filters.action);
      }
      if (filters?.module) {
        params.append("module", filters.module);
      }
      if (filters?.method) {
        params.append("method", filters.method);
      }
      if (filters?.apiPath) {
        params.append("apiPath", filters.apiPath);
      }

      const response = await axios.get(
        `${endpoints.permissions.list}?${params.toString()}`
      );
      return response.data;
    },
  });
};




