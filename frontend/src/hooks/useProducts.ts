import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Product, CreateProductDto, UpdateProductDto } from "@/types/product";
import axiosInstance, { endpoints } from "@/utils/axios";
import { usePermission } from "./usePermission";
import { useToast } from "@/contexts/toast-context";
import { useToastDialog } from "@/contexts/toast-dialog-context";
import { UploadImages } from "@/utils/uploadFile";

// Query Keys
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: { category?: string }) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  byCategory: (categoryId: string) =>
    [...productKeys.all, "byCategory", categoryId] as const,
};

// Get all products
export const useProducts = () => {
  return useQuery({
    queryKey: productKeys.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get(endpoints.products.list);
      return response.data as Product[];
    },
  });
};

// Get products by category
export const useProductsByCategory = (categoryId: string, enabled = true) => {
  return useQuery({
    queryKey: productKeys.byCategory(categoryId),
    queryFn: async () => {
      const response = await axiosInstance.get(
        endpoints.products.byCategory(categoryId)
      );
      return response.data as Product[];
    },
    enabled: enabled && !!categoryId,
  });
};

// Get single product
export const useProduct = (id: string, enabled = true) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get("/products/" + id);
      return response.data as Product;
    },
    enabled: enabled && !!id,
  });
};

// Create product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  // check permission
  const { canCreateProducts } = usePermission();
  if (!canCreateProducts()) return undefined;

  return useMutation({
    mutationFn: async (data: CreateProductDto): Promise<Product> => {
      const response = await axiosInstance.post(
        endpoints.products.create,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Also invalidate category-specific lists if product has a category
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      success(
        "Created New Product",
        "The product has been created successfully."
      );
    },
    onError: (err: any) => {
      // check err.message is array
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};

// Update product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  // check permission
  const { canEditProducts } = usePermission();
  if (!canEditProducts()) return undefined;

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateProductDto;
    }) => {
      const response = await axiosInstance.patch(
        endpoints.products.update(id),
        data
      );
      return response.data as Product;
    },
    onSuccess: (updatedProduct) => {
      // Update the specific product in cache
      queryClient.setQueryData(
        productKeys.detail(updatedProduct._id),
        updatedProduct
      );
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Invalidate category-specific lists
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      success("Updated Product", "The product has been updated successfully.");
    },
    onError: (err: any) => {
      // check err.message is array
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};

// upload product images
export const useUploadProductImages = () => {
  const queryClient = useQueryClient();
  const { error } = useToast();
  // check permission
  const { canEditProducts } = usePermission();
  if (!canEditProducts()) return undefined;
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
          endpoints.products.uploadImages(id)
        );
        return response?.data;
      }
      return true;
    },
    onSuccess: (updatedProduct) => {
      // Update the specific product in cache
      queryClient.setQueryData(
        productKeys.detail(updatedProduct._id),
        updatedProduct
      );
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (err: any) => {
      // check err.message is array
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};

// Delete product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const { confirm } = useToastDialog();

  // check permission
  const { canDeleteProducts } = usePermission();
  if (!canDeleteProducts()) return undefined;

  return useMutation({
    mutationFn: async (id: string) => {
      // Confirm deletion
      const confirmed = await confirm(
        "Confirm Deletion",
        "Are you sure you want to delete this product?"
      );
      if (confirmed === "confirm") {
        const response = await axiosInstance.delete(
          endpoints.products.delete(id)
        );
        success(
          "Deleted Product",
          "The product has been deleted successfully."
        );
        return response.data;
      }
      return undefined;
    },
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      // Invalidate all product-related queries
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: (err: any) => {
      // check err.message is array
      if (Array.isArray(err?.message)) return;
      error("Error", err?.message || "An error occurred.");
    },
  });
};
