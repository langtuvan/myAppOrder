"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Field, Label, Description, ErrorMessage } from "@/components/fieldset";
import { Input, InputGroup } from "@/components/input";
import { Required } from "./required";
import { InputProps } from "@headlessui/react";
import clsx from "clsx";

// ----------------------------------------------------------------------

type Props = {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  type?:
    | "email"
    | "number"
    | "password"
    | "search"
    | "tel"
    | "text"
    | "url"
    | "date";
  disabled?: boolean;
  autoFocus?: boolean;
  helperText?: string;
  className?: string;
  icon?: React.ReactNode;
  required?: boolean;
  inputStyle?: string;
} & InputProps;

export default function RHFTextField({
  name,
  label,
  description,
  placeholder,
  type = "text",
  disabled,
  autoFocus,
  helperText,
  className,
  icon,
  inputStyle,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field className={clsx('mt-4',className)}>
          {label && (
            <Label className="text-nowrap">
              {label} {other.required && <Required />}{" "}
            </Label>
          )}
          {description && <Description>{description}</Description>}

          {icon ? (
            <InputGroup>
              {icon}
              <Input
                {...field}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                autoFocus={autoFocus}
                invalid={!!error}
                value={field.value ?? ""}
                className={inputStyle}
                {...other}
              />
            </InputGroup>
          ) : (
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              autoFocus={autoFocus}
              invalid={!!error}
              value={field.value ?? ""}
              {...other}
              className={inputStyle}
            />
          )}

          {(error || helperText) && (
            <>
              {error && <ErrorMessage>{error.message}</ErrorMessage>}
              {!error && helperText && <Description>{helperText}</Description>}
            </>
          )}
        </Field>
      )}
    />
  );
}
