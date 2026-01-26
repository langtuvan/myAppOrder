"use client";
// React Hook Form
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, RHFTextField } from "@/hooks/RectHookForm";
import { useEffect, useMemo, useState } from "react";
import { Fieldset, Legend } from "@/components/fieldset";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { LoadingButton } from "@/components/loading";
import { Button } from "@/components/button";
import { useUpdateUser } from "@/hooks/useUsers";
import CopyToClipboard from "react-copy-to-clipboard";

type FormValuesPropsChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
type Props = {
  currentData?: any;
};

export function UserChangePasswordForm({ currentData }: Props) {
  const isEditing = !!currentData;
  const router = useRouter();
  const updateMutation = useUpdateUser();

  const defaultValues = useMemo(
    () => ({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    }),
    [currentData],
  );

  const schema = Yup.object().shape({
    oldPassword: Yup.string().required("Old Password is required"),
    newPassword: Yup.string()
      .required("New Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const methods = useForm<FormValuesPropsChangePassword>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesPropsChangePassword) => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
    try {
      isEditing &&
        currentData?._id &&
        (await updateMutation?.mutateAsync({
          id: currentData._id,
          data: { password: data.newPassword },
        }));

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

  useEffect(() => {
    methods.reset();
  }, [currentData]);

  return (
    <FormProvider
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      className=""
    >
      <Fieldset className="grid grid-cols-1 gap-6" disabled={isSubmitting}>
        <RHFTextField
          name="oldPassword"
          label="Old Password"
          type="password"
          required
        />
        <RHFTextField
          name="newPassword"
          label="New Password"
          type="password"
          required
        />
        <RHFTextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          required
        />

        {updateMutation && (
          <LoadingButton
            autoFocus
            isSubmitting={isSubmitting}
            color="blue"
            onClick={handleSubmit((data) => onSubmit(data))}
            className="w-fit"
          >
            Change Password
          </LoadingButton>
        )}
      </Fieldset>
    </FormProvider>
  );
}

type FormValuesPropsResetPassword = {
  newPassword: string;
  confirmPassword: string;
};

export function UserResetPasswordForm({ currentData }: Props) {
  const isEditing = !!currentData;
  const router = useRouter();
  const updateMutation = useUpdateUser();

  const defaultValues = useMemo(
    () => ({
      newPassword: "",
      confirmPassword: "",
    }),
    [currentData],
  );

  const schema = Yup.object().shape({
    newPassword: Yup.string()
      .required("New Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const methods = useForm<FormValuesPropsResetPassword>({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesPropsResetPassword) => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
    try {
      isEditing &&
        currentData?._id &&
        (await updateMutation?.mutateAsync({
          id: currentData._id,
          data: { password: data.newPassword },
        }));

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

  useEffect(() => {
    methods.reset();
  }, [currentData]);

  const [randomPassword, setRandomPassword] = useState("");

  const onGenerateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    methods.setValue("newPassword", randomPassword);
    methods.setValue("confirmPassword", randomPassword);
    setRandomPassword(randomPassword);
  };

  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <FormProvider methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
      <Fieldset className="space-y-6" disabled={isSubmitting}>
        <div className="grid grid-cols-1 gap-6">
          <RHFTextField
            name="newPassword"
            label="New Password"
            type="password"
            required
          />
          <RHFTextField
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            required
          />
        </div>

        {randomPassword && (
          <div className="p-4 bg-green-50 text-green-800 rounded-md">
            <p>User: {currentData?.email}</p>
            <p>
              New Generated Password: <strong>{randomPassword}</strong>
              <CopyToClipboard text={randomPassword} onCopy={handleCopy}>
                <Button color="green" type="button" className="ml-3">
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </CopyToClipboard>
            </p>
          </div>
        )}
        <Button
          onClick={onGenerateRandomPassword}
          color="zinc"
          className="w-full mb-4"
        >
          Generate Random Password
        </Button>

        {updateMutation && (
          <LoadingButton
            autoFocus
            isSubmitting={isSubmitting}
            color="blue"
            onClick={handleSubmit((data) => onSubmit(data))}
          >
            Reset Password
          </LoadingButton>
        )}
      </Fieldset>
    </FormProvider>
  );
}
