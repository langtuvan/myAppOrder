"use client";

/**
 * Common patterns and utilities for React Hook Form
 */

import { useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

/**
 * Hook to get form errors
 */
export function useFormError(name: string) {
  const {
    formState: { errors },
  } = useFormContext();

  const error = name.split(".").reduce((acc, key) => acc?.[key], errors as any);

  return error?.message as string | undefined;
}

/**
 * Hook to watch a field value
 */
export function useFormWatch(name: string) {
  const { watch } = useFormContext();
  return watch(name);
}

/**
 * Hook to get field state
 */
export function useFieldState(name: string) {
  const {
    formState: { errors, dirtyFields, touchedFields },
  } = useFormContext();

  const error = name.split(".").reduce((acc, key) => acc?.[key], errors as any);
  const isDirty = name
    .split(".")
    .reduce((acc, key) => acc?.[key], dirtyFields as any);
  const isTouched = name
    .split(".")
    .reduce((acc, key) => acc?.[key], touchedFields as any);

  return {
    error: error?.message as string | undefined,
    isDirty: Boolean(isDirty),
    isTouched: Boolean(isTouched),
    isValid: !error,
  };
}

/**
 * Common validation rules
 */
export const validationRules = {
  required: (message = "This field is required") => ({
    required: message,
  }),

  email: (message = "Invalid email address") => ({
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message,
    },
  }),

  minLength: (length: number, message?: string) => ({
    minLength: {
      value: length,
      message: message || `Minimum ${length} characters required`,
    },
  }),

  maxLength: (length: number, message?: string) => ({
    maxLength: {
      value: length,
      message: message || `Maximum ${length} characters allowed`,
    },
  }),

  min: (value: number, message?: string) => ({
    min: {
      value,
      message: message || `Minimum value is ${value}`,
    },
  }),

  max: (value: number, message?: string) => ({
    max: {
      value,
      message: message || `Maximum value is ${value}`,
    },
  }),

  pattern: (pattern: RegExp, message: string) => ({
    pattern: {
      value: pattern,
      message,
    },
  }),

  url: (message = "Invalid URL") => ({
    pattern: {
      value: /^https?:\/\/.+/i,
      message,
    },
  }),

  phone: (message = "Invalid phone number") => ({
    pattern: {
      value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      message,
    },
  }),
};

/**
 * Transform options array to format required by components
 */
export function transformOptions<T>(
  items: T[],
  valueKey: keyof T,
  labelKey: keyof T
): Array<{ value: string | number; label: string }> {
  return items.map((item) => ({
    value: String(item[valueKey]),
    label: String(item[labelKey]),
  }));
}

/**
 * Get nested value from object by path string
 */
export function getNestedValue(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

/**
 * Set nested value in object by path string
 */
export function setNestedValue(obj: any, path: string, value: any) {
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  const target = keys.reduce((acc, key) => {
    if (!acc[key]) acc[key] = {};
    return acc[key];
  }, obj);
  target[lastKey] = value;
  return obj;
}
