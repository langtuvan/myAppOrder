"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Field, Label, Description, ErrorMessage } from "@/components/fieldset";
import { Checkbox, CheckboxField } from "@/components/checkbox";
import { Required } from "./required";
import clsx from "clsx";

// ----------------------------------------------------------------------

type Props = {
  name: string;
  label?: string;
  position?: "start" | "end";
  description?: string;
  disabled?: boolean;
  helperText?: string;
  className?: string;
  required?: boolean;
  color?:
    | "dark/zinc"
    | "dark/white"
    | "white"
    | "dark"
    | "zinc"
    | "red"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "green"
    | "emerald"
    | "teal"
    | "cyan"
    | "sky"
    | "blue"
    | "indigo"
    | "violet"
    | "purple"
    | "fuchsia"
    | "pink"
    | "rose";
};

export default function RHFCheckBoxField({
  name,
  label,
  description,
  disabled,
  helperText,
  className,
  position = "start",
  color = "dark/zinc",
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <CheckboxField className={clsx(className)}>
            {label && (
              <>
                <Label>
                  {label} {other.required && <Required />}
                </Label>
                {description && <Description>{description}</Description>}
              </>
            )}

            <Checkbox
              {...field}
              checked={!!field.value}
              onChange={(checked) => field.onChange(checked)}
              disabled={disabled}
              color={color}
              {...other}
            />

            {(error || helperText) && (
              <>
                {error && <ErrorMessage>{error.message}</ErrorMessage>}
                {!error && helperText && (
                  <Description>{helperText}</Description>
                )}
              </>
            )}
          </CheckboxField>
        );
      }}
    />
  );
}
