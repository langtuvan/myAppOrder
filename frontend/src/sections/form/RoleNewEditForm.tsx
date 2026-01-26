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
import { usePermissions } from "@/hooks/usePermissions";
import { ModalLayout } from "@/components/modal";
import { useEffect, useMemo } from "react";
import { Button } from "@/components/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Fieldset } from "@/components/fieldset";
import { useRouter } from "next/navigation";
import { useUpdateRole } from "@/hooks/useRoles";
import { CreateRoleDto, Role } from "@/types/role";
import _ from "lodash";
import { Switch, SwitchField } from "@/components/switch";
import { Badge } from "@/components/badge";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { LoadingButton } from "@/components/loading";
import { useModules } from "@/hooks/useModules";

interface FormValuesProps extends CreateRoleDto {}
type Props = {
  currentData?: Role;
};

// Map HTTP methods to badge colors
const methodColors: Record<string, string> = {
  GET: "green",
  POST: "blue",
  PUT: "yellow",
  PATCH: "orange",
  DELETE: "red",
};

export default function RoleNewEditForm({ currentData }: Props) {
  const isEditing = !!currentData;
  const router = useRouter();
  // fetch data
  const { data: permissionsData } = usePermissions();
  const { data: moduleData } = useModules();
  //use lodash groupBy to group permissions by module name
  const groupedPermissions = useMemo(() => {
    return _.groupBy(permissionsData, (perm) => {
      return perm.module?._id;
    });
  }, [permissionsData]);

  // Initialize mutation hooks

  const updateMutation = useUpdateRole();

  const defaultValues = useMemo(
    () => ({
      name: currentData?.name || "",
      description: currentData?.description || "",
      isActive: currentData?.isActive ?? true,
      permissions: currentData?.permissions.map((perm: any) => perm?._id) || [],
    }),
    [currentData, permissionsData, moduleData],
  );

  const schema = Yup.object().shape({
    name: Yup.string().required().min(2).max(50),
    description: Yup.string().required().min(10).max(200),
    isActive: Yup.boolean().required(),
    permissions: Yup.array().of(Yup.string().required()).min(1).required(),
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
      isEditing &&
        currentData?._id &&
        (await updateMutation?.mutateAsync({
          id: currentData._id,
          data,
        }));

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

  useEffect(() => {
    methods.reset({
      ...defaultValues,
    });
  }, [currentData, moduleData, permissionsData]);

  // Handle permission selection
  const selectedPermissions = methods.watch("permissions");
  const setSelectedPermissions = (id: string, checked: boolean) => {
    const value = checked
      ? [...selectedPermissions, id]
      : selectedPermissions.filter((perm) => perm !== id);
    methods.setValue("permissions", value);
  };

  return (
    <>
      <ModalLayout
        size="5xl"
        dialogTitle={isEditing ? "Edit Role" : "New Role"}
        dialogDescription={
          isEditing ? "Update the role details" : "Create a new role"
        }
      >
        <FormProvider
          methods={methods}
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <Fieldset className="space-y-6" disabled={isSubmitting}>
            <div className="grid grid-cols-1 gap-6">
              <RHFTextField name="name" label={"Name"} required />

              <RHFTextField name="description" label={"Description"} required />

              <RHFCheckBoxField name="isActive" label="Active" color="blue" />

              {/* {map group} */}
              {/* Permissions grouped by module */}
              {Object.entries(groupedPermissions).map(
                ([moduleId, permissions]) => {
                  const findModule = moduleData?.find(
                    (mod) => mod._id === moduleId,
                  );
                  if (!findModule) return null;
                  return (
                    <div
                      key={moduleId}
                      className="space-y-4 ring-1 ring-gray-200 dark:ring-gray-700 p-4 rounded-lg"
                    >
                      <Heading>{findModule.name} Permissions</Heading>
                      <Text>{findModule.description}</Text>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {permissions.map((permission) => {
                          const defaultChecked = selectedPermissions.includes(
                            permission._id,
                          );
                          return (
                            <SwitchField
                              key={permission._id}
                              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex-1">
                                <Badge
                                  color={
                                    (methodColors[permission.method] as any) ||
                                    "gray"
                                  }
                                >
                                  {permission.method}
                                </Badge>
                                <Text className="text-nowrap mt-2">
                                  {permission.name}
                                </Text>
                                <Text className="text-nowrap">
                                  {permission.action}
                                </Text>
                              </div>
                              <Switch
                                name={`permissions.${permission._id}`}
                                color="blue"
                                checked={defaultChecked}
                                onChange={(e) =>
                                  setSelectedPermissions(permission._id, e)
                                }
                              />
                            </SwitchField>
                          );
                        })}
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            <LoadingButton
              autoFocus
              isSubmitting={isSubmitting}
              color="blue"
              onClick={handleSubmit((data) => onSubmit(data))}
            >
              Save
            </LoadingButton>
          </Fieldset>
        </FormProvider>
      </ModalLayout>
    </>
  );
}
