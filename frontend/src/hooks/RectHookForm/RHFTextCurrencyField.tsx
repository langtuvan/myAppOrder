import { useFormContext, Controller } from "react-hook-form";
import { Required } from "./required";
import { type InputProps as HeadlessInputProps } from "@headlessui/react";
import {
  Description,
  ErrorMessage,
  Field,
  Label,
} from "@/components//fieldset";
import { Input } from "@/components/input";
import clsx from "clsx";
import { formatInputNumber } from "@/utils/format-number";
import { useState } from "react";

type Props = HeadlessInputProps & {
  description?: string;
  label?: string;
  name: string;
  className?: string;
  row?: boolean;
};

export default function RHFTextCurrencyField({
  name,
  label,
  description,
  type = "text",
  className,
  row = false,
  ...other
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const { value, ...copyField } = field;
        const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          const raw = event.target.value.replace(/,/g, "");
          if (/^\d*\.?\d*$/.test(raw)) {
            const newPrice = parseFloat(raw === "" ? "" : raw);
            field.onChange(newPrice);
          }
        };

        const formatValue = formatInputNumber(value?.toString());

        if (label) {
          return (
            <Field
              disabled={other.disabled}
              className={clsx(
                row && "flex-row items-baseline gap-2",
                className
              )}
            >
              {label && (
                <Label className="text-nowrap">
                  {label} {other.required && <Required />}
                </Label>
              )}

              <Input
                {...field}
                {...other}
                value={formatValue}
                onChange={handleOnChange}
                name={name}
                id={name}
                ref={field.ref}
                invalid={error ? true : false}
                className="text-right justify-end"
              />

              {description && <Description>{description || ""}</Description>}

              {error && (
                <ErrorMessage>
                  {error ? error?.message : "Not a valid Input."}
                </ErrorMessage>
              )}
            </Field>
          );
        }

        return (
          <>
            <Input
              {...field}
              {...other}
              value={formatValue}
              onChange={handleOnChange}
              name={name}
              id={name}
              ref={field.ref}
              invalid={error ? true : false}
              className={clsx("w-full grow", className)}
            />

            {description && <Description>{description || ""}</Description>}

            {error && (
              <ErrorMessage>
                {error ? error?.message : "Not a valid Input."}
              </ErrorMessage>
            )}
          </>
        );
      }}
    />
  );
}
