"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Field, Label, Description, ErrorMessage } from "@/components/fieldset";
import { Combobox, ComboboxOption, ComboboxLabel } from "@/components/combobox";
import clsx from "clsx";
import { option } from "motion/react-client";
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
  autoFocus?: boolean;
  required?: boolean;
  displayValue?: (value: OptionType | null) => string | undefined;
  filter?: (value: OptionType, query: string) => boolean;
  "aria-label"?: string;
};

export default function RHFComboBox({
  name,
  label,
  description,
  placeholder,
  disabled,
  helperText,
  className,
  options,
  autoFocus,
  displayValue,
  filter,
  "aria-label": ariaLabel,
  required,
  ...other
}: Props) {
  const { control } = useFormContext();

  const defaultDisplayValue = (value: string | null) =>
    options.find((opt) => opt.value === value)?.label || "";
  const as = "div";
  const coypyOther = { as, ...other };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Field className={clsx("mt-6", className)}>
          {label && (
            <Label className="space-x-1">
              <span>{label}</span>
              {required && <Required />}
            </Label>
          )}
          {description && <Description>{description}</Description>}

          <Combobox
            {...field}
            options={options}
            displayValue={displayValue || (defaultDisplayValue as any)}
            filter={filter}
            placeholder={placeholder}
            disabled={disabled}
            autoFocus={autoFocus}
            invalid={!!error}
            aria-label={ariaLabel || label}
            onChange={(value) => field.onChange(value?.value)}
            value={field.value ?? null}
            {...coypyOther}
            className={clsx("mt-4", className)}
          >
            {(option) => (
              <ComboboxOption value={option}>
                <ComboboxLabel>{option.label}</ComboboxLabel>
              </ComboboxOption>
            )}
          </Combobox>

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
