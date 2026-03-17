"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Field, Label, Description, ErrorMessage } from "@/components/fieldset";
import { Select } from "@/components/select";
import { Required } from "./required";

// ----------------------------------------------------------------------

type OptionType = {
  value: string | number;
  label: string;
};

type Props = {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  className?: string;
  options: OptionType[];
  multiple?: boolean;
  required?: boolean;
};

export default function RHFSelectField({
  name,
  label,
  description,
  placeholder,
  disabled,
  helperText,
  className,
  options,
  multiple = false,
  required = false,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field className={className}>
          {label && (
            <Label className="text-nowrap">
              {label} {required && <Required />}
            </Label>
          )}
          {description && <Description>{description}</Description>}

          <Select
            {...field}
            disabled={disabled}
            invalid={!!error}
            multiple={multiple}
            value={field.value ?? (multiple ? [] : "")}
            {...other}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>

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
