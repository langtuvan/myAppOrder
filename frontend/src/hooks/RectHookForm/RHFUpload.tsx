"use client";
import { Controller, useFormContext } from "react-hook-form";
import { type InputProps as HeadlessInputProps } from "@headlessui/react";
import { Upload, UploadBox, UploadAvatar } from "../upload";
import type { UploadProps } from "../upload";
import { Description, ErrorMessage, Field, Label } from "@/components/fieldset";
import { Required } from "./required";

import { Fragment } from "react";

type Props = UploadProps &
  HeadlessInputProps & {
    description?: string;
    label?: string;
    name: string;
    uploadAcceptType: "image" | "file";
    onDelete?: (index: number) => void;
  };

export default function RHFUpload({
  name,
  label,
  description,
  multiple,
  helperText,
  uploadAcceptType,
  onDelete,
  ...other
}: Props) {
  "use client";
  const { control, setValue } = useFormContext();
  const uploadProps =
    uploadAcceptType === "image"
      ? {
          multiple,
          accept: { "image/*": [] },
        }
      : { multiple };

  return (
    <Fragment>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          const onDrop = (acceptedFiles: File[]) => {
            const value = multiple
              ? [...field.value, ...acceptedFiles]
              : acceptedFiles[0];

            setValue(name, value, { shouldValidate: true, shouldDirty: true });
          };

          const onSort = (SortItems: any[]) => {
            SortItems &&
              SortItems.length > 0 &&
              setValue(name, SortItems, {
                shouldValidate: true,
                shouldDirty: true,
              });
          };

          return (
            <Field disabled={other.disabled}>
              {label && (
                <Label>
                  {label} {other.required && <Required />}
                </Label>
              )}
              <Upload
                {...uploadProps}
                value={field.value}
                onDrop={onDrop}
                onSort={onSort}
                {...other}
              />
              {description && <Description>{description || ""}</Description>}

              {error && (
                <ErrorMessage>
                  {error ? error?.message : "Not a valid Input."}
                </ErrorMessage>
              )}
            </Field>
          );
        }}
      />
    </Fragment>
  );
}

export function RHFUploadAvatar({ name, label, description, ...other }: Props) {
  const { control, setValue } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const onDrop = (acceptedFiles: File[]) => {
          const value = acceptedFiles[0];

          setValue(name, value, { shouldValidate: true });
        };

        return (
          <Field disabled={other.disabled}>
            {label && (
              <Label>
                {label} {other.required && <Required />}
              </Label>
            )}
            <UploadAvatar
              value={field.value}
              error={!!error}
              onDrop={onDrop}
              {...other}
            />

            {description && <Description>{description || ""}</Description>}

            {error && (
              <ErrorMessage>
                {error ? error?.message : "Not a valid Input."}
              </ErrorMessage>
            )}
          </Field>
        );
      }}
    />
  );
}

// ----------------------------------------------------------------------

export function RHFUploadBox({ name, label, description, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field disabled={other.disabled}>
          {label && (
            <Label>
              {label} {other.required && <Required />}
            </Label>
          )}
          <UploadBox value={field.value} error={!!error} {...other} />
          {description && <Description>{description || ""}</Description>}

          {error && (
            <ErrorMessage>
              {error ? error?.message : "Not a valid Input."}
            </ErrorMessage>
          )}
        </Field>
      )}
    />
  );
}
