import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance, { endpoints } from "@/utils/axios";
import {
  CreateCustomerDto,
  Customer,
  CustomersListResponse,
  CustomersQueryParams,
  UpdateCustomerDto,
  CustomerStats,
} from "@/types/customer";
import { useToast } from "@/contexts/toast-context";
import { usePermission } from "./usePermission";
import { useToastDialog } from "./useToastDialog";

// Query Keys
export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (params: CustomersQueryParams) =>
    [...customerKeys.lists(), params] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  stats: () => [...customerKeys.all, "stats"] as const,
};

// Query Hooks
export function useCustomersTable(params: CustomersQueryParams = {}) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: async (): Promise<CustomersListResponse> => {
      const response = await axiosInstance.get(
        endpoints.customers.list(params)
      );
      return response.data;
    },
  });
}

export function useCustomers(params: CustomersQueryParams = {}) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: async (): Promise<CustomersListResponse> => {
      const response = await axiosInstance.get(
        endpoints.customers.list(params)
      );
      return response.data;
    },
  });
}

export function useCustomer(id: string, enabled = true) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: async (): Promise<Customer> => {
      const response = await axiosInstance.get(endpoints.customers.details(id));
      return response.data;
    },
    enabled: enabled && !!id,
  });
}

export function useCustomerStats() {
  return useQuery({
    queryKey: customerKeys.stats(),
    queryFn: async (): Promise<CustomerStats> => {
      const response = await axiosInstance.get(endpoints.customers.stats);
      return response.data;
    },
  });
}

// Mutation Hooks
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  // check permission
  const { canCreateCustomers } = usePermission();
  if (!canCreateCustomers()) return undefined;

  return useMutation({
    mutationFn: async (data: CreateCustomerDto): Promise<Customer> => {
      const response = await axiosInstance.post(
        endpoints.customers.create,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
      success(
        'Customer Created',
        'The customer has been created successfully.'
      );
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error(
        'Error',
        err?.message || 'An error occurred.'
      );
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  // check permission
  const { canEditCustomers } = usePermission();
  if (!canEditCustomers()) return undefined;

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCustomerDto;
    }): Promise<Customer> => {
      const response = await axiosInstance.patch(
        endpoints.customers.update(id),
        data
      );
      return response.data;
    },
    onSuccess: (updatedCustomer) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.setQueryData(
        customerKeys.detail(updatedCustomer._id as string),
        updatedCustomer
      );
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
      success(
        'Customer Updated',
        'The customer has been updated successfully.'
      );
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error(
        'Error',
        err?.message || 'An error occurred.'
      );
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { confirm } = useToastDialog();

  // check permission
  const { canDeleteCustomers } = usePermission();
  if (!canDeleteCustomers()) return undefined;

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // Confirm deletion
      const confirmed = await confirm(
        'Confirm Deletion',
        'Are you sure you want to delete this customer?'
      );
      if (confirmed === "confirm") {
        await axiosInstance.delete(endpoints.customers.delete(id));
        success(
          'Customer Deleted',
          'The customer has been deleted successfully.'
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error(
        'Error',
        err?.message || 'An error occurred.'
      );
    },
  });
}

export function useRestoreCustomer() {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  // check permission
  const { canRestoreCustomers } = usePermission();
  if (!canRestoreCustomers()) return undefined;

  return useMutation({
    mutationFn: async (id: string): Promise<Customer> => {
      const response = await axiosInstance.put(endpoints.customers.restore(id));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: customerKeys.stats() });
      success(
        'Customer Restored',
        'The customer has been restored successfully.'
      );
    },
    onError: (err: any) => {
      if (Array.isArray(err?.message)) return;
      error(
        'Error',
        err?.message || 'An error occurred.'
      );
    },
  });
}

// Helper to normalize phone strings (digits only)
const normalizePhone = (val?: string) => (val ?? "").replace(/\D/g, "");

// Lazy query: find a customer by phone on demand
export function useLazyCustomerByPhone() {
  return useMutation({
    mutationFn: async (phone: string): Promise<Customer[]> => {
      const query = (phone ?? "").trim();
      if (!query) return [];

      const res = await axiosInstance.get(
        endpoints.customers.findByPhone(query)
      );

      return res.data;
    },
  });
}
