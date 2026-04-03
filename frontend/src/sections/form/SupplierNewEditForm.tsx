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
  useCreateSupplier,
  useUpdateSupplier,
  useDeleteSupplier,
} from "@/hooks/useSuppliers";
import { useEffect, useMemo } from "react";
import { Fieldset } from "@/components/fieldset";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { LoadingButton } from "@/components/loading";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/button";
import { useDictionary } from "@/dictionaries/locale";
import { CreateSupplierDto, Supplier } from "@/types/supplier";
import { ModalLayout } from "@/components/modal";

interface FormValuesProps extends CreateSupplierDto {}
type Props = {
  currentData?: Supplier;
};

export default function SupplierNewEditForm({ currentData }: Props) {
  const formattedMessage = useDictionary();
  const isEditing = !!currentData;

  const createMutation = useCreateSupplier();
  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name || "",
      contactPerson: currentData?.contactPerson || "",
      email: currentData?.email || "",
      phone: currentData?.phone || "",
      address: currentData?.address || "",
      city: currentData?.city || "",
      country: currentData?.country || "",
      postalCode: currentData?.postalCode || "",
      companyName: currentData?.companyName || "",
      taxId: currentData?.taxId || "",
      isActive: currentData?.isActive ?? true,
      description: currentData?.description || "",
    }),
    [currentData],
  );

  const schema = Yup.object().shape({
    name: Yup.string().required().min(2).max(50),
    contactPerson: Yup.string().max(100).required(),
    email: Yup.string().email().max(100).required(),
    phone: Yup.string().max(20).required(),
    address: Yup.string().max(200),
    city: Yup.string().max(100),
    country: Yup.string().max(100),
    postalCode: Yup.string().max(20),
    companyName: Yup.string().max(100),
    taxId: Yup.string().max(50),
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
    <ModalLayout
      dialogTitle={
        isEditing ? formattedMessage.common.edit : formattedMessage.common.add
      }
    >
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Fieldset className="space-y-6" disabled={isSubmitting}>
          <div className="grid grid-cols-1 gap-6">
            <RHFTextField
              name="name"
              label={formattedMessage.admin.inventory.suppliers.column.name}
              required
            />

            <RHFTextField
              name="contactPerson"
              label={
                formattedMessage.admin.inventory.suppliers.column.contactPerson
              }
              required
            />

            <RHFTextField
              name="email"
              label={formattedMessage.admin.inventory.suppliers.column.email}
              required
            />

            <RHFTextField
              name="phone"
              label={formattedMessage.admin.inventory.suppliers.column.phone}
              required
            />

            <RHFTextField
              name="address"
              label={formattedMessage.admin.inventory.suppliers.column.address}
              required
            />

            <RHFTextField
              name="city"
              label={formattedMessage.admin.inventory.suppliers.column.city}
              required
            />

            <RHFTextField
              name="country"
              label={formattedMessage.admin.inventory.suppliers.column.country}
              required
            />

            <RHFTextField
              name="postalCode"
              label={
                formattedMessage.admin.inventory.suppliers.column.postalCode
              }
              required
            />

            <RHFTextField
              name="companyName"
              label={
                formattedMessage.admin.inventory.suppliers.column.companyName
              }
              required
            />

            <RHFTextField
              name="description"
              label={
                formattedMessage.admin.inventory.suppliers.column.description
              }
              required
            />

            <RHFCheckBoxField
              name="isActive"
              label={formattedMessage.admin.inventory.suppliers.column.isActive}
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
