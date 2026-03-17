"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Field, Label, Description, ErrorMessage } from "@/components/fieldset";
import { Textarea } from "@/components/textarea";

// ----------------------------------------------------------------------

type Props = {
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  className?: string;
  resizable?: boolean;
  rows?: number;
};

export default function RHFTextAreaField({
  name,
  label,
  description,
  placeholder,
  disabled,
  helperText,
  className,
  resizable = true,
  rows,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field className={className}>
          {label && <Label>{label}</Label>}
          {description && <Description>{description}</Description>}

          <Textarea
            {...field}
            placeholder={placeholder}
            disabled={disabled}
            resizable={resizable}
            rows={rows}
            invalid={!!error}
            value={field.value ?? ""}
            {...other}
          />

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
