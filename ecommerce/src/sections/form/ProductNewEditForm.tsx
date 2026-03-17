"use client";
// React Hook Form
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormProvider,
  RHFSelectField,
  RHFTextField,
  RHFCheckBoxField,
  RHFUpload,
} from "@/hooks/RectHookForm";
import { useCategories } from "@/hooks/useCategories";
import { useEffect, useMemo } from "react";
import { Fieldset } from "@/components/fieldset";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { LoadingButton } from "@/components/loading";
import { CreateProductDto, Product } from "@/types/product";
import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
  useUploadProductImages,
} from "@/hooks/useProducts";
import { Button } from "@/components/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { CategoryType } from "@/types/category";
import axiosInstance, { endpoints } from "@/utils/axios";
import { validateProduct } from "@/actions/fetchData";
import { ModalLayout } from "@/components/modal";

interface FormValuesProps extends CreateProductDto {}
type Props = {
  currentData?: Product;
};

export default function ProductNewEditForm({ currentData }: Props) {
  const isEditing = !!currentData;

  // fetch data options
  const { data: categories = [] } = useCategories();
  const categoriesFiltered = categories.filter(
    (category) => category.type === CategoryType.PRODUCT,
  );

  // Initialize mutation hooks
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const uploadMutation = useUploadProductImages();

  const defaultValues = useMemo(
    () => ({
      category: currentData?.category._id || "", // Category ID
      name: currentData?.name || "",
      description: currentData?.description || "",
      price: currentData?.price || 0,
      images: currentData?.images || [], // images can be File[] or string[] or null
      stock: currentData?.stock || 0,
      // // isAvailable: currentData?.isAvailable || false,
      isActive: currentData?.isActive || true,
      sku: currentData?.sku || "",
    }),
    [currentData],
  );

  const schema = Yup.object().shape({
    category: Yup.string().required(),
    name: Yup.string().required().min(2),
    description: Yup.string().required().min(5),
    images: Yup.array().required(),
    price: Yup.number().required().min(0),
    stock: Yup.number()
      .required("Stock is required")
      .min(0, "Stock must be at least 0"),
    sku: Yup.string().max(50, "SKU must be less than 50 characters").required(),
    isActive: Yup.boolean().required(),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    setValue,
    getValues,
    formState: { isSubmitting, errors },
  } = methods;

  const router = useRouter();
  const onSubmit = async (data: FormValuesProps) => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
    const { images, ...rest } = data;
    try {
      const response =
        isEditing && currentData?._id
          ? await updateMutation?.mutateAsync({
              id: currentData._id,
              data: rest,
            })
          : await createMutation?.mutateAsync(rest as CreateProductDto);
      validateProduct();

      await uploadMutation?.mutateAsync({
        id: response!._id,
        name: data.name,
        images: images as any,
      });

      router.back();
    } catch (errors: ErrorFormSubmit | any) {
      console.log("errors", errors);
      _.isArray(errors?.message) &&
        errors?.message.length > 0 &&
        errors.message.map((err: any) => {
          setError(err.field, {
            type: "manual",
            message: err.message,
          });
        });
    }
  };

  const onDelete = async () => {
    if (!currentData?._id) return;
    await deleteMutation?.mutateAsync(currentData._id).then((data) => {
      validateProduct();
      router.back();
    });
  };

  useEffect(() => {
    methods.reset();
  }, [currentData]);

  const onDeleteImage = async (index: number) => {
    const currentImages = getValues("images") || [];
    const updatedImages = currentImages.filter(
      (_: any, imgIndex: number) => imgIndex !== index,
    );
    setValue("images", updatedImages, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // find image is string to delete
    const imageToDelete = currentImages[index];
    if (typeof imageToDelete === "string") {
      const imageName = imageToDelete.split("/").pop();
      try {
        await axiosInstance.post(
          endpoints.products.deleteImage(currentData?._id || ""),
          {
            imageUrl: imageName,
          },
        );
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  const formattedLanguage = {
    isEditing: isEditing ? "Editing Product" : "Add New Product",
    title: "Product",
    name: "Name",
    description: "Description",
    category: "Category",
    price: "Price",
    stock: "Stock",
    sku: "SKU",
    addBtn: "Add",
    imageSrc: "imageSrc",
  };

  return (
    <ModalLayout dialogTitle={isEditing ? "Edit Product" : "Add Product"}>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Fieldset className="space-y-6" disabled={isSubmitting}>
          <div className="grid grid-cols-1 gap-6">
            <RHFTextField name="name" label={formattedLanguage.name} required />

            <RHFUpload
              label="Pictures"
              name="images"
              thumbnail
              multiple
              uploadAcceptType="image"
              onRemove={(index) => onDeleteImage(index as number)}
              //onRemoveAll={() => console.log('onRemoveALL')}
            />

            <RHFSelectField
              name="category"
              label={formattedLanguage.category}
              options={[
                { _id: "", name: "Select a category" },
                ...categoriesFiltered,
              ]?.map((category) => ({
                value: category._id,
                label: category.name,
              }))}
            />
            <RHFTextField name="sku" label={formattedLanguage.sku} required />
            <RHFTextField
              name="price"
              label={formattedLanguage.price}
              required
            />

            <RHFTextField
              name="description"
              label={formattedLanguage.description}
              required
            />

            <RHFTextField
              disabled
              name="stock"
              label={formattedLanguage.stock}
              required
            />

            <RHFCheckBoxField name="isActive" label="Active" color="blue" />
          </div>

          {isEditing && deleteMutation && (
            <Button plain onClick={handleSubmit(() => onDelete())}>
              <TrashIcon />
            </Button>
          )}

          {(createMutation || updateMutation) && (
            <LoadingButton
              autoFocus
              isSubmitting={isSubmitting}
              color="blue"
              onClick={handleSubmit((data) => onSubmit(data))}
            >
              Save
            </LoadingButton>
          )}
        </Fieldset>
      </FormProvider>
    </ModalLayout>
  );
}
