"use client";
import { Checkbox, CheckboxField } from "@/components/checkbox";
import { Label } from "@/components/fieldset";
import { Heading } from "@/components/heading";
import { Strong, Text, TextLink } from "@/components/text";
import { Logo } from "@/components/logo";
import { useAuth } from "@/hooks/useAuth";
// React Hook Form
import * as Yup from "yup";
import { Form, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, RHFTextField } from "@/hooks/RectHookForm";
import paths from "@/router/path";
import { LoadingButton } from "@/components/loading";
import _, { set } from "lodash";

type FormValuesProps = {
  email: string;
  password: string;
};

export default function SignInForm() {
  //const router = useRouter();
  const { login } = useAuth();

  const schema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .email("Email must be a valid email address"),
    password: Yup.string().required("Password is required"),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "admin@booking.com",
      password: "Admin@123",
      // name: "Demo Customer",
      // email: "customer@booking.com",
      // password: "Customer@123",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await login(data.email, data.password);
    } catch (errs: any) {
      _.isArray(errs?.message)
        ? errs?.message.length > 0 &&
          errs.message.map((err: any) => {
            setError(err.field, {
              type: "server",
              message: err.message,
            });
          })
        : setError("password", {
            type: "server",
            message: errs?.message || "Login failed",
          });
    }
  };

  return (
    <FormProvider
      methods={methods}
      onSubmit={handleSubmit(onSubmit)}
      className="grid w-full max-w-sm grid-cols-1 gap-8"
    >
      <Heading>Sign in to your account</Heading>
      <RHFTextField name="email" label="Email address" />
      <RHFTextField name="password" label="Password" type="password" />
      <div className="flex items-center justify-between">
        <CheckboxField>
          <Checkbox name="remember" />
          <Label>Remember me</Label>
        </CheckboxField>
        <Text>
          <TextLink href="#">
            <Strong>Forgot password?</Strong>
          </TextLink>
        </Text>
      </div>
      <LoadingButton
        isSubmitting={methods.formState.isSubmitting}
        type="submit"
      >
        Login
      </LoadingButton>
      {/* <Text>
          Don’t have an account?{" "}
          <TextLink href={paths.auth.register}>
            <Strong>Sign up</Strong>
          </TextLink>
        </Text> */}
    </FormProvider>
  );
}
