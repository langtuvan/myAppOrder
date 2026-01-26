"use client";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import {
  Field,
  Input,
  Label,
  Radio,
  RadioGroup,
  Select,
} from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import vietNamLocation from "@/mock/provinces_and_wards_full.json";
import { ECOMMERCE_VARIABLES } from "@/config-global";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "./loading";
import {
  DeliveryMethod,
  deliveryMethods,
  OrderExport,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  WebsiteOrderDto,
} from "@/hooks/useOrders";
import axiosInstance from "@/utils/axios";
import { uuidv7 } from "uuidv7";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider } from "@/hooks/RectHookForm";
import { set } from "lodash";

const plans = [
  { id: "cod", name: "Thanh toán khi nhận hàng", status: true },
  { id: "bank", name: "Chuyển khoản ngân hàng", status: false },
  { id: "qr", name: "Quét mã Qr", status: false },
];

const steps = [
  { name: "Cart", href: "/cart-summary", status: "complete" },
  { name: "Billing Information", href: "/check-out", status: "current" },
  { name: "Confirmation", href: "#", status: "upcoming" },
];

const Required = () => <span className="text-red-600 ml-1">*</span>;

export default function CheckOut() {
  const { provinces, table } = vietNamLocation;
  const [wardList, setWardList] = useState<any>([]);
  // state for payment method
  const [selectedMethod, setSelectedMethod] = useState(plans[0]);
  const cart = useCartStore((s) => s);

  const defaultValues = useMemo(
    () => ({
      _id: uuidv7(),
      orderType: OrderType.WEBSITE,
      orderExport: OrderExport.NORMAL,
      // trackingNumber: "",
      // customer info
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      // // status
      status: OrderStatus.PENDING,
      notes: "",
      // //cart
      items: cart.items,
      // payment method
      paymentMethod: PaymentMethod.CASH,
      paymentStatus: PaymentStatus.UNPAID,
      paymentCardNumber: "",
      paymentCode: "",
      customerPay: 0,
      taxes: ECOMMERCE_VARIABLES.taxRate,
      discount: cart.discount,
      // // delivery method
      deliveryMethod: deliveryMethods[1].id,
      deliveryPrice: cart.deliveryPrice,
      // // shipping Address
      province: "79",
      ward: "",
      address: "",
    }),
    [cart],
  );

  const schema = Yup.object().shape({
    _id: Yup.string(),
    orderType: Yup.mixed<OrderType>().required(),
    orderExport: Yup.mixed<OrderExport>().required(),
    // customer info
    customerName: Yup.string().required(),
    customerPhone: Yup.string().required(),
    customerEmail: Yup.string().email(),
    // // cart
    items: Yup.array()
      .of(
        Yup.object()
          .shape({
            product: Yup.string().required(),
            productName: Yup.string().required(),
            imageSrc: Yup.string().required(),
            quantity: Yup.number().min(1).required(),
            price: Yup.number().min(0).required(),
            // test status is confirmed
            status: Yup.mixed<OrderStatus>().required(),
            date: Yup.string(),
          })
          .required(),
      )
      .required(),
    // // status
    status: Yup.mixed<OrderStatus>().required(),
    notes: Yup.string(),
    // // // payment method
    paymentMethod: Yup.mixed<PaymentMethod>().required(),
    paymentStatus: Yup.mixed<PaymentStatus>().required(),
    paymentCode: Yup.string(),
    taxes: Yup.number().min(0).required(),
    discount: Yup.number().min(0).required(),
    // delivery method
    deliveryMethod: Yup.mixed<DeliveryMethod>().required(),
    deliveryPrice: Yup.number().required(),
    // shipping address
    province: Yup.string().required(),
    ward: Yup.string().required(),
    address: Yup.string().required(),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
    const _id = uuidv7();
    try {
      await axiosInstance.post("/orders/public", {
        ...data,
        _id,
        items,
      });

      clear();
      route.replace("/order-detail/" + _id);
    } catch (error) {
      console.error("Failed to create order:", error);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    // Handle form submission here (e.g., send to API)
  };

  const handleSetValueProvince = (value: string) => {
    setValue("province", value, { shouldValidate: true });
    setWardList(provinces[value as keyof typeof provinces]?.wards || []);
  };

  useEffect(() => {
    setWardList(
      provinces[methods.watch("province") as keyof typeof provinces]?.wards ||
        [],
    );
  }, [methods.watch("province")]);

  const handleSetValueWard = (value: string) => {
    setValue("ward", value || "", { shouldValidate: true });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col dark:text-white">
      {/* Background color split screen for large screens */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 hidden h-full w-1/2 bg-white dark:bg-gray-900 lg:block"
      />
      <div
        aria-hidden="true"
        className="fixed top-0 right-0 hidden h-full w-1/2 bg-gray-100 dark:bg-gray-900 lg:block border-2 border-l border-gray-200 dark:border-gray-800"
      />

      <header className="relative border-b border-gray-200 bg-white dark:bg-gray-800  text-sm font-medium ">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="relative flex justify-end sm:justify-center">
            <Link href="/" className="absolute top-1/2 left-0 -mt-4">
              <span className="sr-only">Your Company</span>
              <img
                alt=""
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                className="h-8 w-auto"
              />
            </Link>
            <nav aria-label="Progress" className="hidden sm:block">
              <ol role="list" className="flex space-x-4">
                {steps.map((step, stepIdx) => (
                  <li key={step.name} className="flex items-center">
                    {step.status === "current" ? (
                      <Link
                        href={step.href}
                        aria-current="page"
                        className="text-indigo-600 dark:text-indigo-400 font-semibold"
                      >
                        {step.name}
                      </Link>
                    ) : (
                      <Link href={step.href}>{step.name}</Link>
                    )}

                    {stepIdx !== steps.length - 1 ? (
                      <ChevronRightIcon
                        aria-hidden="true"
                        className="ml-4 size-5 text-gray-300"
                      />
                    ) : null}
                  </li>
                ))}
              </ol>
            </nav>
            <p className="sm:hidden">Step 2 of 4</p>
          </div>
        </div>
      </header>

      <main className="relative sm:mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 xl:gap-x-48">
        <h1 className="sr-only">Order information</h1>

        <section
          aria-labelledby="summary-heading"
          className="order-2 lg:order-2    px-4 pt-16 pb-10 sm:px-6 lg:col-start-2 lg:row-start-1  lg:px-0 lg:pb-16"
        >
          <div className="mx-auto max-w-lg lg:max-w-none">
            <section aria-labelledby="payment-heading" className="">
              <h2 id="payment-heading" className="text-lg font-medium">
                Payment details
              </h2>

              <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 ">
                <RadioGroup
                  by="name"
                  value={selectedMethod}
                  onChange={setSelectedMethod}
                  aria-label="Server size"
                  className="space-y-2"
                >
                  {plans.map((plan) => (
                    <Radio
                      disabled={!plan.status}
                      key={plan.name}
                      value={plan}
                      className={clsx(
                        "group relative flex cursor-pointer rounded-lg  px-5 py-4 border-1 border-gray-300 transition focus:not-data-focus:outline-none data-checked:bg-blue-600 data-checked:text-white data-focus:outline-1 data-focus:outline-blue-700",
                      )}
                    >
                      <div
                        className={clsx(
                          "flex w-full items-center justify-between ",
                          selectedMethod.id === plan.id && "dark:lg:text-white",
                          !plan.status && "opacity-50 cursor-not-allowed",
                        )}
                      >
                        <div className="text-sm/6">
                          <p className="font-semibold uppercase">{plan.id}</p>
                          <div className="flex gap-2 ">
                            <div>{plan.name}</div>
                          </div>
                        </div>
                        <CheckCircleIcon className="size-6 fill-white opacity-0 transition group-data-checked:opacity-100" />
                      </div>
                    </Radio>
                  ))}
                </RadioGroup>
              </div>
            </section>

            <section aria-labelledby="billing-heading" className="mt-10">
              <h2 id="billing-heading" className="text-lg font-medium ">
                Billing information
              </h2>

              <div className="mt-6 flex gap-3">
                <div className="flex h-5 shrink-0 items-center">
                  <div className="group grid size-4 grid-cols-1 ">
                    <input
                      id="same-as-shipping"
                      type="checkbox"
                      //{...register("sameAsShipping")}
                      className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                    />
                    <svg
                      fill="none"
                      viewBox="0 0 14 14"
                      className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                    >
                      <path
                        d="M3 8L6 11L11 3.5"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 group-has-checked:opacity-100"
                      />
                      <path
                        d="M3 7H11"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="opacity-0 group-has-indeterminate:opacity-100"
                      />
                    </svg>
                  </div>
                </div>
                <label
                  htmlFor="same-as-shipping"
                  className="text-sm font-medium  "
                >
                  Same as shipping information
                </label>
              </div>
            </section>

            <div className="mt-10 border-t border-gray-200 pt-6 sm:flex sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleSubmit((data) => onSubmit(data))}
                className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden sm:order-last sm:ml-6 sm:w-auto"
              >
                Continue
              </button>
              <p className="mt-4 text-center text-sm  sm:mt-0 sm:text-left">
                You won't be charged until the next step.
              </p>
            </div>
            <div className="my-6 text-center text-sm text-gray-500">
              <p>
                or{" "}
                <Link
                  href="/cart-summary"
                  className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Check Cart
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </section>

        <main className="order-1 lg:order-1 px-4 pt-16 pb-36 sm:px-6 lg:col-start-1 lg:row-start-1 lg:px-0 lg:pb-16">
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className="mx-auto max-w-lg lg:max-w-none">
              <section aria-labelledby="contact-info-heading">
                <h2 id="contact-info-heading" className="text-lg font-medium ">
                  Contact information
                </h2>

                <div className="mt-6">
                  <label
                    htmlFor="email-address"
                    className="block text-sm/6 font-medium text-gray-700 dark:text-white/70"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <Input
                      id="email-address"
                      type="email"
                      {...register("customerEmail")}
                      autoComplete="email"
                      className={`block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-700 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500 ${
                        errors.customerEmail
                          ? "outline-red-500 focus:outline-red-600"
                          : "outline-gray-300 focus:outline-indigo-600"
                      }`}
                    />
                    {errors.customerEmail && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.customerEmail.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="phone"
                    className="block text-sm/6 font-medium text-gray-700 dark:text-white/70"
                  >
                    Phone <Required />
                  </label>
                  <div className="mt-2">
                    <Input
                      id="phone"
                      type="tel"
                      {...register("customerPhone")}
                      autoComplete="tel"
                      className={`block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-700 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500 ${
                        errors.customerPhone
                          ? "outline-red-500 focus:outline-red-600"
                          : "outline-gray-300 focus:outline-indigo-600"
                      }`}
                    />
                    {errors.customerPhone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.customerPhone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label
                    htmlFor="fullName"
                    className="block text-sm/6 font-medium text-gray-700 dark:text-white/70"
                  >
                    Full name <Required />
                  </label>
                  <div className="mt-2">
                    <Input
                      id="fullName"
                      type="text"
                      {...register("customerName")}
                      autoComplete="name"
                      className={`block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-700 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500 ${
                        errors.customerName
                          ? "outline-red-500 focus:outline-red-600"
                          : "outline-gray-300 focus:outline-indigo-600"
                      }`}
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.customerName.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section aria-labelledby="shipping-heading" className="mt-10">
                <h2 id="shipping-heading" className="text-lg font-medium ">
                  Shipping address
                </h2>
                <Field className="mt-6">
                  <Label
                    htmlFor="province"
                    className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                  >
                    Location
                  </Label>

                  <div className="mt-2 grid grid-cols-1">
                    <Select
                      {...register("province")}
                      value={methods.getValues("province")}
                      onChange={(e) => handleSetValueProvince(e.target.value)}
                      id="province"
                      name="province"
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus-visible:outline-indigo-500"
                    >
                      <option value="">Select Province</option>
                      {table.map((province) => (
                        <option key={province.name} value={province.id}>
                          {province.name}
                        </option>
                      ))}
                    </Select>

                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
                    />
                  </div>
                  {errors.province && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.province.message}
                    </p>
                  )}
                </Field>

                <Field className="mt-6">
                  <Label
                    htmlFor="location"
                    className="block text-sm/6 font-medium text-gray-900 dark:text-white"
                  >
                    Ward
                  </Label>

                  <div className="mt-2 grid grid-cols-1">
                    <Select
                      {...register("ward")}
                      onChange={(e) => handleSetValueWard(e.target.value)}
                      id="ward"
                      name="ward"
                      className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:*:bg-gray-800 dark:focus-visible:outline-indigo-500"
                    >
                      <option value="">Select Ward</option>
                      {wardList.map((ward: any) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </Select>

                    <ChevronDownIcon
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400"
                    />
                  </div>
                  {errors.ward && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.ward.message}
                    </p>
                  )}
                </Field>

                <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="address"
                      className="block text-sm/6 font-medium text-gray-700 dark:text-white/70"
                    >
                      Address <Required />
                    </label>
                    <div className="mt-2">
                      <Input
                        id="address"
                        type="text"
                        {...register("address")}
                        autoComplete="street-address"
                        className={`block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-700 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500 ${
                          errors.address
                            ? "outline-red-500 focus:outline-red-600"
                            : "outline-gray-300 focus:outline-indigo-600"
                        }`}
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.address.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="apartment"
                      className="block text-sm/6 font-medium text-gray-700 dark:text-white/70"
                    >
                      Notes
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="notes"
                        cols={4}
                        {...register("notes")}
                        className="block w-full rounded-md bg-white py-1.5 pr-12 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-gray-700 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </FormProvider>
        </main>
      </main>
    </div>
  );
}
