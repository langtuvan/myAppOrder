"use client";
// React Hook Form
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormProvider,
  RHFTextField,
  RHFCheckBoxField,
} from "@/hooks/RectHookForm";
import {
  useCreateWarehouse,
  useUpdateWarehouse,
  useDeleteWarehouse,
} from "@/hooks/useWarehouses";
import { useEffect, useMemo } from "react";
import { Fieldset } from "@/components/fieldset";
import { useRouter } from "next/navigation";

import _ from "lodash";
import { LoadingButton } from "@/components/loading";
import { Warehouse, CreateWarehouseDto } from "@/types/warehouse";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/button";
import formattedMessage from "@/language/language";
import { ModalLayout } from "@/components/modal";

interface FormValuesProps extends CreateWarehouseDto {}
type Props = {
  currentData?: Warehouse;
};

export default function WarehouseNewEditForm({ currentData }: Props) {
  const isEditing = !!currentData;

  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();
  const deleteMutation = useDeleteWarehouse();

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name || "",
      description: currentData?.description || "",
      location: currentData?.location || "",
      isActive: currentData?.isActive ?? true,
    }),
    [currentData],
  );

  const schema = Yup.object().shape({
    name: Yup.string().required().min(2).max(50),
    location: Yup.string().required().min(5).max(200),
    description: Yup.string().max(500),
    isActive: Yup.boolean().required(),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const router = useRouter();

  const onSubmit = async (data: FormValuesProps) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      isEditing && currentData?._id
        ? await updateMutation?.mutateAsync({
            id: currentData._id,
            data,
          })
        : await createMutation?.mutateAsync(data);

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
    router.back();
  };

  useEffect(() => {
    reset();
  }, [currentData]);

  return (
    <ModalLayout dialogTitle={isEditing ? "Edit Warehouse" : "Add Warehouse"}>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Fieldset className="space-y-6" disabled={isSubmitting}>
          <div className="grid grid-cols-1 gap-6">
            <RHFTextField
              name="name"
              label={formattedMessage.inventory.warehouses.form.name}
              required
            />

            <RHFTextField
              name="location"
              label={formattedMessage.inventory.warehouses.form.location}
              required
            />

            <RHFTextField
              name="description"
              label={formattedMessage.inventory.warehouses.form.description}
              required
            />

            <RHFCheckBoxField
              name="isActive"
              label={formattedMessage.inventory.warehouses.form.isActive}
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
              autoFocus
              isSubmitting={isSubmitting}
              color="blue"
              onClick={handleSubmit((data) => onSubmit(data))}
            >
              {formattedMessage.common.save}
            </LoadingButton>
          )}
        </Fieldset>
      </FormProvider>
    </ModalLayout>
  );
}
