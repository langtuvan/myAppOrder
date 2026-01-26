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
} from "@/hooks/RectHookForm";

import { useEffect, useMemo } from "react";
import { Fieldset } from "@/components/fieldset";
import { useRouter } from "next/navigation";
import { CreateUserDto, User } from "@/types/user";

import _ from "lodash";
import { LoadingButton } from "@/components/loading";
import { Button } from "@/components/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useCreateUser, useDeleteUser, useUpdateUser } from "@/hooks/useUsers";
import { useRoles } from "@/hooks/useRoles";

interface FormValuesProps extends CreateUserDto {}
type Props = {
  currentData?: User;
};

export default function UserNewEditForm({ currentData }: Props) {
  const isEditing = !!currentData;
  const router = useRouter();
  // fetch data options
  const { data: roles = [] } = useRoles({ isActive: true, deleted: false });

  // // Initialize mutation hooks
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name || "",
      email: currentData?.email || "",
      password: "",
      age: currentData?.age || undefined,
      address: currentData?.address || "",
      isActive: currentData?.isActive ?? true,
      role: currentData?.role._id || "",
      gender: currentData?.gender || "male",
    }),
    [currentData]
  );

  const schema = Yup.object().shape({
    name: Yup.string().required().min(2).max(50),
    role: Yup.string().required(),
    email: Yup.string().required().email(),
    gender: Yup.string().oneOf(["male", "female", "other"]).required(),
    isActive: Yup.boolean().required(),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
    try {
      isEditing && currentData?._id
        ? await updateMutation?.mutateAsync({
            id: currentData._id,
            data: _.omit(data, ["password"]), // update without changing password
          })
        : await createMutation?.mutateAsync(data);

      router.back();
    } catch (errors: any) {
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
    await deleteMutation?.mutateAsync(currentData?._id as any);
    router.back();
  };

  useEffect(() => {
    methods.reset();
  }, [currentData]);

  return (
    <>
      <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
        <Fieldset className="space-y-6" disabled={isSubmitting}>
          <div className="grid grid-cols-1 gap-6">
            <RHFTextField name="name" label="Name" required />

            <RHFTextField
              name="email"
              label="Email"
              required
              placeholder="e.g., user@example.com"
            />

            <RHFTextField
              name="password"
              disabled={isEditing}
              label="Password"
              type="password"
              //description="default new user with password is 123456"
              required
            />

            <RHFTextField name="address" label="Address" />

            <RHFSelectField
              name="gender"
              label="Gender"
              options={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Other", value: "other" },
              ]}
            />

            <RHFSelectField
              name="role"
              label="Role"
              options={
                roles?.length > 0
                  ? [{ _id: "", name: "Select a role" }, ...roles].map(
                      (role: any) => ({
                        label: role.name,
                        value: role._id,
                      })
                    )
                  : []
              }
              //placeholder="Select Role"
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
              {isEditing ? "Edit" : "Add"}
            </LoadingButton>
          )}
        </Fieldset>
      </FormProvider>
    </>
  );
}
