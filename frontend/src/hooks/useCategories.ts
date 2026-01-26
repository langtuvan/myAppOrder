import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/types/category";
import axiosInstance, { endpoints } from "@/utils/axios";
import { useToast } from "@/contexts/toast-context";
import { useToastDialog } from "./useToastDialog";
import { usePermission } from "./usePermission";
import { UploadImages } from "@/utils/uploadFile";

// Query Keys
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

// Get all categories
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.categories.list);
      return response.data as Category[];
    },
  });
};

// Get single category

interface Cat extends Omit<Category, "tags"> {
  tags: string[];
}
export const useCategory = (id: string, enabled = true) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(
        endpoints.categories.details(id)
      );
      return response.data as Cat;
    },
    enabled: enabled && !!id,
  });
};

// Create category
export const useCreateCategory = () => {
  const { canCreateCategories } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  if (!canCreateCategories()) return undefined;
  return useMutation({
    mutationFn: async (data: CreateCategoryDto) => {
      const response = await axiosInstance.post(
        endpoints.categories.create,
        data
      );
      success(
        'Created New Category',
        'The category has been created successfully.'
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (err: any) => {
        if (Array.isArray(err?.message)) return;
      error(
        'Error',
        err?.message || 'An error occurred.'
      );
    },
  });
};

// Update category
export const useUpdateCategory = () => {
  const { canEditCategories } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  if (!canEditCategories()) return undefined;

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCategoryDto;
    }) => {
      const response = await axiosInstance.patch(
        endpoints.categories.update(id),
        data
      );
      success('Updated Category', 'The category has been updated successfully.');
      return response.data as Category;
    },
    onSuccess: (updatedCategory) => {
      // Update the specific category in cache
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory?._id as string),
        updatedCategory
      );
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (err: any) => {
        if (Array.isArray(err?.message)) return;
      error(
        'Error',
        err?.message || 'An error occurred.'
      );
    },
  });
};

// Delete category
export const useDeleteCategory = () => {
  const { canDeleteCategories } = usePermission();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { confirm } = useToastDialog();

  if (!canDeleteCategories()) return undefined;

  return useMutation({
    mutationFn: async (id: string) => {
      // Confirm deletion
      const confirmed = await confirm(
        'Confirm Deletion',
        'Are you sure you want to delete this category?'
      );
      if (confirmed === "confirm") {
        const response = await axiosInstance.delete(
          endpoints.categories.delete(id)
        );
        success('Deleted Category', 'The category has been deleted successfully.');
        return response.data;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (err: any) => {
        if (Array.isArray(err?.message)) return;
      error(
        'Error',
        err?.message || 'An error occurred.'
      );
    },
  });
};


// upload category images
export const useUploadCategoryImages = () => {
  const queryClient = useQueryClient();
  const {  error } = useToast();
  // check permission
  const { canEditCategories } = usePermission();
  if (!canEditCategories()) return undefined;
  return useMutation({
    mutationFn: async ({
      id,
      name,
      images,
    }: {
      id: string;
      name: string;
      images: File[];
    }) => {
      // upload image files
      const hasImagesUpload =
        images && images.some((item: File | string) => item instanceof File);

      if (hasImagesUpload) {
        const response = await UploadImages(
          images &&
            images.filter((item: File | string) => item instanceof File),
          name,
          endpoints.categories.uploadImages(id)
        );
        return response?.data;
      }
    },
    onSuccess: (updatedCategory) => {
      // Update the specific category in cache
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory?._id as string),
        updatedCategory
      );
      // Invalidate and refetch categories list
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
    onError: (err: any) => {
      // check err.message is array
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};
