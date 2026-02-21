"use client";
// React Hook Form
import * as Yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormProvider,
  RHFTextField,
  RHFCheckBoxField,
  RHFSelectField,
  RHFUpload,
} from "@/hooks/RectHookForm";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useUploadCategoryImages,
} from "@/hooks/useCategories";
import { useEffect, useMemo } from "react";
import { Field, Fieldset, Label } from "@/components/fieldset";
import { useRouter } from "next/navigation";

import _ from "lodash";
import { LoadingButton } from "@/components/loading";
import { Category, CreateCategoryDto } from "@/types/category";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/button";
import { CategoryType } from "@/types/category";

import axiosInstance, { endpoints } from "@/utils/axios";
import { validateCategory } from "@/actions/fetchData";
import { ModalLayout } from "@/components/modal";
import language from "@/language/language";

interface FormValuesProps extends CreateCategoryDto {}
type Props = {
  currentData?: Category;
};

const formattedMessage = language.inventory.categories;
const formattedCommon = language.common;

export default function CategoryNewEditForm({ currentData }: Props) {
  const isEditing = !!currentData;
  // Initialize mutation hooks
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const uploadMutation = useUploadCategoryImages();

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name || "",
      type: currentData?.type || CategoryType.PRODUCT,
      description: currentData?.description || "",
      images: currentData?.images || [],
      isActive: currentData?.isActive ?? true,
    }),
    [currentData],
  );

  const schema = Yup.object().shape({
    //type is one of CategoryType
    type: Yup.string<CategoryType>()
      .oneOf(Object.values(CategoryType))
      .required(),
    name: Yup.string().required().min(2).max(50),
    description: Yup.string().required().min(5).max(200),
    isActive: Yup.boolean().required(),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    setError,
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const router = useRouter();
  const onSubmit = async (data: FormValuesProps) => {
    const { images, ...copyData } = data;
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    try {
      const response =
        isEditing && currentData?._id
          ? await updateMutation?.mutateAsync({
              id: currentData._id,
              data: copyData,
            })
          : await createMutation?.mutateAsync(copyData);

      await uploadMutation?.mutateAsync({
        id: response!._id,
        name: data.name,
        images: images as any,
      });
      validateCategory();

      router.back();
    } catch (errors: ErrorFormSubmit | any) {
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
    await deleteMutation?.mutateAsync(currentData?._id as string);
    validateCategory();
    router.back();
  };

  useEffect(() => {
    reset();
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

  return (
    <ModalLayout
      dialogTitle={isEditing ? formattedCommon.edit : formattedCommon.add}
    >
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Fieldset className="space-y-6" disabled={isSubmitting}>
          <div className="grid grid-cols-1 gap-6">
            <RHFTextField
              name="name"
              label={formattedMessage.form.name}
              required
            />

            <RHFUpload
              label={formattedMessage.form.images}
              name="images"
              thumbnail
              multiple
              uploadAcceptType="image"
              onRemove={(index) => onDeleteImage(index as number)}
              //onRemoveAll={() => console.log('onRemoveALL')}
            />

            <RHFSelectField
              name="type"
              label={formattedMessage.form.type}
              disabled
              options={
                CategoryType
                  ? Object.values(CategoryType).map((type) => ({
                      label: type.charAt(0) + type.slice(1).toLowerCase(), // Capitalize first letter
                      value: type,
                    }))
                  : []
              }
              required
            />

            <RHFTextField
              name="description"
              label={formattedMessage.form.description}
              required
            />
            <RHFCheckBoxField
              name="isActive"
              label={formattedMessage.form.isActive}
              color="blue"
            />
          </div>

          {isEditing && deleteMutation && (
            <Button plain onClick={handleSubmit(() => onDelete())}>
              <TrashIcon />
            </Button>
          )}

          {(createMutation || updateMutation) && (
            <LoadingButton
              //type="submit"
              autoFocus
              isSubmitting={isSubmitting}
              color="blue"
              onClick={handleSubmit((data) => onSubmit(data))}
            >
              {formattedCommon.save}
            </LoadingButton>
          )}
        </Fieldset>
      </FormProvider>
    </ModalLayout>
  );
}
