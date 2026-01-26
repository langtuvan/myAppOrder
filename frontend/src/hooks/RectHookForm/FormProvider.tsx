"use client";

import {
  FormProvider as RHFFormProvider,
  UseFormReturn,
} from "react-hook-form";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
  methods: UseFormReturn<any>;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
};

export default function FormProvider({
  children,
  onSubmit,
  methods,
  className,
}: Props) {
  return (
    <RHFFormProvider {...methods}>
      <form onSubmit={onSubmit} className={className}>
        {children}
      </form>
    </RHFFormProvider>
  );
}
