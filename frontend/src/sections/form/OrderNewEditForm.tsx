"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormProvider,
  RHFTextField,
  RHFComboBox,
  RHFTextCurrencyField,
} from "@/hooks/RectHookForm";
import {
  Input,
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import { Input as InputComponent } from "@/components/input";
import vietNamLocation from "@/mock/provinces_and_wards_full.json";
import { uuidv7 } from "uuidv7";

import {
  ChevronUpIcon,
  ChevronLeftIcon,
  PlusIcon,
  MinusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import {
  PaymentMethod,
  deliveryMethods,
  paymentMethods,
  PaymentStatus,
  DeliveryMethod,
  useCreateOrder,
  useUpdateOrder,
  useDeleteOrder,
  OrderType,
  OrderStatus,
  OrderExport,
  Order,
  Item,
  StatusColor,
} from "@/hooks/useOrders";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { fCurrencyVND, formatInputNumber } from "@/utils/format-number";
import { Checkbox, CheckboxField } from "@/components/checkbox";

import { ECOMMERCE_VARIABLES } from "@/config-global";
import { Badge } from "@/components/badge";
import clsx from "clsx";
import { LoadingButton } from "@/components/loading";
import { Field, Fieldset, Label } from "@/components/fieldset";
import UseImage from "@/hooks/useImage";
import { ProductGridList } from "../list/product-list";
import { Button } from "@/components/button";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "@/components/dialog";
import paths from "@/router/path";
import { Strong, Text } from "@/components/text";
import { PrintBill } from "@/components/PrintBill";

interface FormValuesProps extends Order {}

export enum StepType {
  ADD_ITEMS = "add-items",
  CART_SUMMARY = "cart-summary",
  CHECKOUT = "checkout",
}

type Props = {
  currentData?: Order;
  defaultStep?: StepType;
};

export default function OrderNewEditForm({
  currentData,
  defaultStep = StepType.ADD_ITEMS,
}: Props) {
  const isEditing = !!currentData;
  const [currentStep, setCurrentStep] = useState<StepType>(defaultStep);
  const [showPrintBill, setShowPrintBill] = useState(false);
  const [submittedOrderData, setSubmittedOrderData] = useState<Order | null>(
    null,
  );
  const router = useRouter();
  const { provinces, table } = vietNamLocation;

  // permissions & mutations
  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();

  const defaultValues = useMemo(
    () => ({
      orderType: currentData?.orderType || OrderType.IN_STORE,
      orderExport: currentData?.orderExport || OrderExport.QUICK,
      trackingNumber: currentData?.trackingNumber || "",
      // customer info
      customerName: currentData?.customerName || "Guest",
      customerPhone: currentData?.customerPhone || "0000000000",
      customerEmail: currentData?.customerEmail || "guest@example.com",
      // status
      status: currentData?.status || OrderStatus.PENDING,
      notes: currentData?.notes || "",
      //cart
      items: currentData?.items || [],
      // payment method
      paymentMethod: currentData?.paymentMethod || PaymentMethod.CASH,
      paymentStatus: currentData?.paymentStatus || PaymentStatus.UNPAID,
      paymentCardNumber: currentData?.paymentCardNumber || "",
      paymentCode: currentData?.paymentCode || "",
      customerPay: currentData?.customerPay || 0,
      customerPayCod: currentData?.customerPayCod || 0,
      taxes: currentData?.taxes || ECOMMERCE_VARIABLES.taxRate,
      discount: currentData?.discount || 0,
      // // delivery method
      deliveryMethod: currentData?.deliveryMethod || deliveryMethods[0].id,
      deliveryPrice: currentData?.deliveryPrice || deliveryMethods[0].price,
      // // shipping Address
      province: currentData?.province || "",
      ward: currentData?.ward || "",
      address: currentData?.address || "",
    }),
    [currentData],
  );

  const schema = Yup.object().shape({
    orderType: Yup.mixed<OrderType>().required(),
    orderExport: Yup.mixed<OrderExport>().required(),
    trackingNumber: Yup.string(),
    // customer info
    customerName: Yup.string().required(),
    customerPhone: Yup.string().required(),
    customerEmail: Yup.string().email(),
    // cart
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
    // status
    status: Yup.mixed<OrderStatus>().required(),
    notes: Yup.string(),
    // // payment method
    paymentMethod: Yup.mixed<PaymentMethod>().required(),
    customerPay: Yup.number(),
    customerPayCod: Yup.number(),
    paymentStatus: Yup.mixed<PaymentStatus>().required(),
    paymentCardNumber: Yup.string().test(
      "payment-card-number-required",
      "Card number is required",
      function (value) {
        const { paymentMethod } = this.parent;
        if (paymentMethod === PaymentMethod.ETRANSFER) {
          return !!value;
        }
        return true;
      },
    ),
    paymentCode: Yup.string(),
    taxes: Yup.number().min(0).required(),
    discount: Yup.number().min(0).required(),
    // delivery method
    deliveryMethod: Yup.mixed<DeliveryMethod>().required(),
    deliveryPrice: Yup.number().required(),
    // shipping address
    province: Yup.string().test(
      "province-required",
      "Province is required",
      function (value) {
        const { orderType } = this.parent;
        if (orderType === OrderType.DELIVERY) {
          return !!value;
        }
        return true;
      },
    ),

    ward: Yup.string().test(
      "ward-required",
      "Ward is required",
      function (value) {
        const { orderType } = this.parent;
        if (orderType === OrderType.DELIVERY) {
          return !!value;
        }
        return true;
      },
    ),
    address: Yup.string().test(
      "address-required",
      "Address is required",
      function (value) {
        const { orderType } = this.parent;
        if (orderType === OrderType.DELIVERY) {
          return !!value;
        }
        return true;
      },
    ),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const values = methods.watch();

  const { handleSubmit, setError, setValue } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation

    try {
      const result =
        isEditing && currentData?._id
          ? await updateMutation?.mutateAsync({
              id: currentData._id,
              data,
            })
          : await createMutation?.mutateAsync(data);

      if (isEditing) {
        return router.push(paths.dashboard.orders.list);
      } else {
        // Show print bill for new orders
        setSubmittedOrderData(result || data);
        setShowPrintBill(true);
      }

      setCurrentStep(StepType.ADD_ITEMS);
      methods.reset({ ...defaultValues, orderExport: data.orderExport });
      // router.back();
    } catch (errors: ErrorFormSubmit | any) {
      _.isArray(errors?.message) &&
        errors?.message.length > 0 &&
        errors.message.map((err: any) => {
          setError(err.field, {
            type: "manual",
            message: err.message,
          });
        });
    }
  };

  // const handleOnCloesePrintBill = () => {
  //   setShowPrintBill(false);
  // };

  useEffect(() => {
    methods.reset({ ...defaultValues });
  }, [currentData]);

  console.log("values", values);
  console.log("currentData", currentData);

  // useMemo provinceList
  const provinceList = useMemo(
    () =>
      table.map((province: any) => ({
        label: province.name,
        value: province.code,
      })),
    [table],
  );

  const selectedProvince = useMemo(
    () =>
      (provinces as Record<string, any>)[values?.province as any] ?? {
        wards: [],
      },
    [provinces, values.province],
  );

  const wardList = useMemo(
    () =>
      selectedProvince.wards.map((ward: any) => ({
        label: ward.name,
        value: ward.code,
      })),
    [values.province],
  );

  // guest mode
  const [guestMode, setGuestMode] = useState(true);
  const onCheckGuest = (value: boolean) => {
    setGuestMode(value);
    if (value) {
      methods.setValue("customerName", "Guest");
      methods.setValue("customerPhone", "0000000000");
      methods.setValue("customerEmail", "guest@example.com");
    } else {
      methods.setValue("customerName", "");
      methods.setValue("customerPhone", "");
      methods.setValue("customerEmail", "");
    }
  };

  // delivery Mode
  // const [isDelivery, setIsDelivery] = useState(false);
  const onCheckDeliveryMode = (value: boolean) => {
    //setIsDelivery(value);
    methods.setValue(
      "orderType",
      value ? OrderType.DELIVERY : OrderType.IN_STORE,
    );

    if (value) {
      methods.setValue("deliveryMethod", deliveryMethods[1].id);
      methods.setValue("deliveryPrice", deliveryMethods[1].price);
      methods.setValue("customerName", "");
      methods.setValue("customerPhone", "");
      methods.setValue("customerEmail", "");
      methods.setValue("province", "79");
    } else {
      methods.setValue("deliveryMethod", deliveryMethods[0].id);
      methods.setValue("deliveryPrice", deliveryMethods[0].price);
      methods.setValue("customerName", "Guest");
      methods.setValue("customerPhone", "0000000000");
      methods.setValue("customerEmail", "guest@example.com");
    }
  };

  // useFieldArray for items cart
  const { update, remove } = useFieldArray({
    control: methods.control,
    name: "items",
  });

  const formattedLanguage = {
    customerName: "Customer Name",
    customerPhone: "Customer Phone",
    customerEmail: "Customer Email",
    notes: "Notes",
    status: "Status",
    province: "Province",
    ward: "Ward",
    address: "Address",
  };

  const disableForm =
    currentData?.status !== OrderStatus.PENDING ||
    methods.formState.isSubmitting;

  // Step navigation handlers
  const handleNextStep = async () => {
    if (currentStep === StepType.ADD_ITEMS) {
      // Validate items exist
      if (values.items?.length === 0) {
        alert("Please add at least one item");
        return;
      }
      setCurrentStep(StepType.CART_SUMMARY);
    } else if (currentStep === StepType.CART_SUMMARY) {
      setCurrentStep(StepType.CHECKOUT);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === StepType.CART_SUMMARY) {
      setCurrentStep(StepType.ADD_ITEMS);
    } else if (currentStep === StepType.CHECKOUT) {
      setCurrentStep(StepType.CART_SUMMARY);
    }
  };

  const steps = [
    { id: StepType.ADD_ITEMS, name: "Add Items", number: 1 },
    { id: StepType.CART_SUMMARY, name: "Cart Summary", number: 2 },
    { id: StepType.CHECKOUT, name: "Checkout", number: 3 },
  ];

  const currentStepNumber =
    steps.find((s) => s.id === currentStep)?.number || 1;

  const [openCustomerInfoForm, setOpenCustomerInfoForm] = useState(false);
  const [openShippingAddressForm, setOpenShippingAddressForm] = useState(false);

  // query
  const [query, setQuery] = useState("");
  // const [customerPay, setCustomerPay] = useState(0);

  // display selected location
  const [findLocation, setFindLocation] = useState("");
  useEffect(() => {
    const findWard = wardList.find((w: any) => w.value === `${values.ward}`);
    setFindLocation(
      `${findWard?.label || ""}, ${selectedProvince?.name || ""}, Vietnam`,
    );
  }, [values.province, values.ward]);

  if (!values) return null;

  const subTotal = useMemo(
    () =>
      values.items?.reduce((acc: number, item: any) => {
        return acc + item.price * item.quantity;
      }, 0) || 0,
    [values.items],
  );

  // useMemo summary bill
  const summaryBill = useMemo(
    () => ({
      quantity: values.items?.reduce((acc: number, item: any) => {
        return acc + item.quantity;
      }, 0),

      taxes: ECOMMERCE_VARIABLES.taxRate * subTotal,
      // total calculation if subtotal > freeShippingWhenSubtotalExceeds => free shipping
      total:
        subTotal +
        (subTotal > ECOMMERCE_VARIABLES.freeShippingWhenSubtotalExceeds
          ? 0
          : values.deliveryPrice || 0) +
        ECOMMERCE_VARIABLES.taxRate * subTotal,
    }),
    [subTotal, values.deliveryPrice],
  );

  useEffect(() => {
    //setCustomerPay(summaryBill.total);
    setValue("customerPay", summaryBill.total);
  }, [summaryBill.total]);

  // calculate taxes and delivery price when items change
  useEffect(() => {
    if (values?.items?.length === 0) {
      return;
    }
    // setValue
    setValue("taxes", ECOMMERCE_VARIABLES.taxRate * subTotal);
    // delivery price adjustment
    if (subTotal > ECOMMERCE_VARIABLES.freeShippingWhenSubtotalExceeds) {
      setValue("deliveryPrice", 0);
    } else {
      const selectedDeliveryMethod = deliveryMethods.find(
        (method) => method.id === values.deliveryMethod,
      );
      setValue(
        "deliveryPrice",
        selectedDeliveryMethod ? selectedDeliveryMethod.price : 0,
      );
    }
  }, [values.items]);

  return (
    <div className="fixed z-50 inset-0 flex flex-1 flex-col top-0 min-w-screen h-screen justify-center overflow-hidden">
      <div className="border-b flex-none border-gray-200 bg-white dark:bg-gray-700 z-50 p-4 md:p-4 sm:px-6 lg:px-0">
        <section className="mx-auto max-w-7xl ">
          <div className="flex justify-between flex-row-reverse items-center">
            <div className="flex flex-row items-center gap-3">
              <Button
                onClick={() => router.back()}
                plain
                className="justify-end-safe"
              >
                Back
              </Button>
            </div>

            <div className="flex flex-row ">
              <div
                className={clsx(
                  "grid grid-cols-1",
                  currentStep !== StepType.ADD_ITEMS && "hidden",
                )}
              >
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pr-3 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
                />
                <MagnifyingGlassIcon
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400 sm:size-4 dark:text-gray-500"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <FormProvider
        methods={methods}
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col overflow-auto"
      >
        <Fieldset>
          {/* Step 1: Add Items */}
          {currentStep === StepType.ADD_ITEMS && (
            <Suspense fallback={<div>Loading...</div>}>
              <ProductGridList query={query} />
            </Suspense>
          )}
          {/* Step 2: Cart Summary */}
          {currentStep === StepType.CART_SUMMARY && (
            <div className="flex flex-1 flex-col  mx-auto max-w-7xl overflow-y-auto">
              <section
                aria-labelledby="summary-heading"
                className="grow px-2 sm:px-6 lg:px-0 "
              >
                <h2
                  id="summary-heading"
                  className="text-lg font-medium text-gray-900 mt-6 "
                >
                  Cart Items{" "}
                </h2>

                {values.items.length === 0 ? (
                  <div className="text-center my-16">
                    <svg
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className="mx-auto size-12 text-gray-400 dark:text-gray-500"
                    >
                      <path
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                        strokeWidth={2}
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                      No items found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Get started by creating a new item.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setCurrentStep(StepType.ADD_ITEMS)}
                        type="button"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:shadow-none dark:hover:bg-indigo-400 dark:focus-visible:outline-indigo-500"
                      >
                        <PlusIcon
                          aria-hidden="true"
                          className="mr-1.5 -ml-0.5 size-5"
                        />
                        New Item
                      </button>
                    </div>
                  </div>
                ) : (
                  <ul
                    role="list"
                    className="divide-y divide-gray-200 border-gray-200  "
                  >
                    {values.items.map((item: Item, idx: number) => (
                      <li key={item?._id} className="flex py-2  sm:py-4">
                        <div className="shrink-0">
                          <UseImage
                            alt={item.imageSrc}
                            src={item.imageSrc}
                            width={200}
                            height={200}
                            className="size-20 sm:size-20"
                          />
                        </div>

                        <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                          <div>
                            <div className="flex justify-between sm:grid sm:grid-cols-2">
                              <div className="pr-6">
                                <h3 className="text-sm mt-2">
                                  <a className="font-medium">
                                    {item.productName}
                                  </a>
                                </h3>
                                <Text className="mt-2 ">
                                  <Strong>{fCurrencyVND(item.price)}</Strong>
                                </Text>
                              </div>

                              <Text className="text-right text-sm font-medium flex flex-col items-end justify-end ">
                                <Strong>
                                  {fCurrencyVND(item.price * item.quantity)}
                                </Strong>
                                <Badge
                                  color={
                                    StatusColor[
                                      item.status.toUpperCase() as keyof typeof StatusColor
                                    ]
                                  }
                                >
                                  {item.status}
                                </Badge>
                              </Text>
                            </div>

                            <div className="mt-4 flex items-center sm:absolute sm:top-0 sm:left-1/2 sm:mt-0 sm:block justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  outline
                                  disabled={item.quantity <= 1}
                                  onClick={() => {
                                    update(idx, {
                                      ...item,
                                      quantity: Math.max(0, item.quantity - 1),
                                    });
                                  }}
                                >
                                  <MinusIcon />
                                </Button>
                                <span className="w-6 text-center tabular-nums select-none">
                                  {item.quantity}
                                </span>
                                <Button
                                  outline
                                  onClick={() =>
                                    update(idx, {
                                      ...item,
                                      quantity: item.quantity + 1,
                                    })
                                  }
                                >
                                  <PlusIcon />
                                </Button>
                              </div>
                              <Button plain onClick={() => remove(idx)}>
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <dl className="flex-none  space-y-4 border-t dark:bg-zinc-800   p-2 rounded-t-lg   border-gray-200 pt-6 text-sm font-medium  lg:block  ">
                <div className="flex items-center justify-between">
                  <dt className="">Subtotal</dt>
                  <dd>{fCurrencyVND(subTotal)}</dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="">
                    <CheckboxField className="flex flex-row-reverse">
                      <Checkbox
                        checked={values.orderType === OrderType.DELIVERY}
                        onChange={onCheckDeliveryMode}
                        name="shipping"
                      />
                      <Label>shipping</Label>
                    </CheckboxField>
                  </dt>
                  <dd className="space-x-2">
                    <span className={clsx(subTotal > 200000 && "line-through")}>
                      {fCurrencyVND(values.deliveryPrice)}
                    </span>
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="">
                    Taxes{" "}
                    <Badge color="zinc">
                      {ECOMMERCE_VARIABLES.taxRate * 100} %
                    </Badge>
                  </dt>
                  <dd>{fCurrencyVND(summaryBill.taxes)}</dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="">Discount</dt>
                  <dd>{fCurrencyVND(values.discount)}</dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <dt className="text-base">Total</dt>
                  <dd className="text-base">
                    {fCurrencyVND(summaryBill.total)}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          {/* Step 3: Checkout */}
          {currentStep === StepType.CHECKOUT && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-10 mx-auto max-w-7xl overflow-hidden ">
              <div className="px-4 pt-16 pb-36 sm:px-6 lg:col-span-2 lg:px-0 lg:pb-16">
                <div className="mx-auto lg:max-w-none">
                  <section aria-labelledby="contact-info-heading">
                    <h2
                      id="contact-info-heading"
                      className="text-lg font-medium  mb-6 flex justify-between items-center"
                    >
                      <span>Contact Information</span>{" "}
                      <Button
                        onClick={() => setOpenCustomerInfoForm(true)}
                        plain
                      >
                        <PlusIcon />
                      </Button>
                    </h2>

                    <div className="space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded">
                      <p>
                        <strong>Name:</strong> {values.customerName}{" "}
                        {methods.formState?.errors.customerName?.message && (
                          <Badge color="red">
                            {
                              methods.formState?.errors.customerName
                                ?.message as string
                            }
                          </Badge>
                        )}
                      </p>
                      <p>
                        <strong>Phone:</strong> {values.customerPhone}
                        {methods.formState?.errors.customerPhone?.message && (
                          <Badge color="red">
                            {
                              methods.formState?.errors.customerPhone
                                ?.message as string
                            }
                          </Badge>
                        )}
                      </p>
                      <p>
                        <strong>Email:</strong> {values.customerEmail}
                        {methods.formState?.errors.customerEmail?.message && (
                          <Badge color="red">
                            {
                              methods.formState?.errors.customerEmail
                                ?.message as string
                            }
                          </Badge>
                        )}
                      </p>
                    </div>
                    <Dialog
                      open={openCustomerInfoForm}
                      onClose={() => setOpenCustomerInfoForm(false)}
                    >
                      <DialogTitle>Customer Info</DialogTitle>
                      <DialogBody>
                        <RHFTextField
                          name="customerEmail"
                          label={formattedLanguage.customerEmail}
                          type="email"
                          autoComplete="email"
                        />

                        <RHFTextField
                          required
                          name="customerPhone"
                          label={formattedLanguage.customerPhone}
                          autoComplete="tel"
                        />
                        <RHFTextField
                          required
                          name="customerName"
                          label={formattedLanguage.customerName}
                          autoComplete="name"
                        />
                      </DialogBody>
                      <DialogActions>
                        <CheckboxField>
                          <Checkbox
                            name="guestMode"
                            checked={guestMode}
                            onChange={onCheckGuest}
                            disabled={isEditing}
                          />
                          <Label>Guest Mode</Label>
                        </CheckboxField>

                        <Button onClick={() => setOpenCustomerInfoForm(false)}>
                          Close
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </section>

                  {values.orderType === OrderType.DELIVERY && (
                    <section
                      aria-labelledby="shipping-heading"
                      className="my-10"
                    >
                      <h2
                        id="shipping-heading"
                        className="text-lg font-medium  mb-6 flex justify-between items-center"
                      >
                        <span> Shipping Address</span>
                        <Button
                          onClick={() => setOpenShippingAddressForm(true)}
                          plain
                        >
                          <PlusIcon />
                        </Button>
                      </h2>

                      <div className="space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded">
                        <p>
                          <strong>Address:</strong> {values.address}{" "}
                          {methods.formState?.errors.address?.message && (
                            <Badge color="red">
                              {
                                methods.formState?.errors.address
                                  ?.message as string
                              }
                            </Badge>
                          )}
                        </p>
                        <p>
                          <strong>Province:</strong> {findLocation}{" "}
                          {methods.formState?.errors.ward?.message && (
                            <Badge color="red">
                              {
                                methods.formState?.errors.ward
                                  ?.message as string
                              }
                            </Badge>
                          )}
                        </p>
                      </div>
                      <Dialog
                        open={openShippingAddressForm}
                        onClose={() => setOpenShippingAddressForm(false)}
                      >
                        <DialogTitle>Shipping Address</DialogTitle>
                        <DialogBody>
                          <RHFComboBox
                            name="province"
                            label={formattedLanguage.province}
                            options={provinceList}
                          />
                          <RHFComboBox
                            name="ward"
                            label={formattedLanguage.ward}
                            options={wardList}
                          />
                          <RHFTextField
                            name="address"
                            label={formattedLanguage.address}
                          />
                        </DialogBody>
                        <DialogActions>
                          <Button
                            onClick={() => setOpenShippingAddressForm(false)}
                          >
                            Close
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </section>
                  )}

                  <dl className="hidden  space-y-4 border-t border-gray-200 pt-6 text-sm font-medium  lg:block">
                    <div className="flex items-center justify-between">
                      <dt className="">Subtotal</dt>
                      <dd>{fCurrencyVND(subTotal)}</dd>
                    </div>

                    {values.orderType === OrderType.DELIVERY && (
                      <div className="flex items-center justify-between">
                        <dt className="">Shipping</dt>
                        <dd className="space-x-2">
                          <span
                            className={clsx(
                              subTotal > 200000 && "line-through",
                            )}
                          >
                            {fCurrencyVND(values.deliveryPrice)}
                          </span>
                        </dd>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <dt className="">
                        Taxes{" "}
                        <Badge color="zinc">
                          {ECOMMERCE_VARIABLES.taxRate * 100} %
                        </Badge>
                      </dt>
                      <dd>{fCurrencyVND(summaryBill.taxes)}</dd>
                    </div>

                    <div className="flex items-center justify-between">
                      <dt className="">
                        Discount{" "}
                        {/* <Badge color="zinc">
                            {ECOMMERCE_VARIABLES.taxRate * 100} %
                          </Badge> */}
                      </dt>
                      <dd>{fCurrencyVND(values.discount)}</dd>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                      <dt className="text-base">Total </dt>
                      <dd className="text-base">
                        {fCurrencyVND(summaryBill.total)}
                      </dd>
                    </div>
                    {currentData && (
                      <>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                          <dt className="text-base">Payment Status </dt>
                          <dd className="text-base">
                            <Badge
                              color={
                                currentData?.paymentStatus ===
                                PaymentStatus.PAID
                                  ? "green"
                                  : "yellow"
                              }
                            >
                              {currentData?.paymentStatus}
                            </Badge>
                          </dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                          <dt className="text-base">Order Status</dt>
                          <dd className="text-base">
                            <Badge
                              color={
                                StatusColor[
                                  currentData?.status.toUpperCase() as keyof typeof StatusColor
                                ]
                              }
                            >
                              {currentData?.status}
                            </Badge>
                          </dd>
                        </div>
                      </>
                    )}

                    {values.paymentMethod === PaymentMethod.CASH &&
                      values.orderType === OrderType.IN_STORE &&
                      values.paymentStatus === PaymentStatus.UNPAID && (
                        <PayCashHelper totalAmount={summaryBill.total} />
                      )}
                  </dl>

                  <section aria-labelledby="payment-heading" className="mt-10">
                    <h2 id="payment-heading" className="text-lg font-medium ">
                      Payment details
                    </h2>

                    <fieldset className="mt-4">
                      <legend className="sr-only">Payment type</legend>
                      <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                        {paymentMethods.map((paymentMethod) => (
                          <div
                            key={paymentMethod.id}
                            className="flex items-center"
                          >
                            <input
                              disabled={
                                values.paymentStatus === PaymentStatus.PAID
                              }
                              onChange={() => {
                                setValue(
                                  "paymentMethod",
                                  paymentMethod.id as any,
                                );
                              }}
                              defaultChecked={
                                paymentMethod.id === values.paymentMethod
                              }
                              id={paymentMethod.id}
                              name="payment-type"
                              type="radio"
                              className="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden"
                            />
                            <label
                              htmlFor={paymentMethod.id}
                              className="ml-3 block text-sm/6 font-medium "
                            >
                              {paymentMethod.title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </fieldset>

                    <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
                      {values.paymentMethod === PaymentMethod.ETRANSFER && (
                        <div className="col-span-3 sm:col-span-4">
                          <div className="mt-2">
                            <RHFTextField
                              name="paymentCardNumber"
                              label="Card number"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </section>

                  {values.orderType === OrderType.DELIVERY && (
                    <section
                      aria-labelledby="payment-heading"
                      className="mt-10"
                    >
                      <h2 id="payment-heading" className="text-lg font-medium ">
                        COD details
                      </h2>

                      <fieldset className="mt-4">
                        <legend className="sr-only">COD details</legend>
                        <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10"></div>
                      </fieldset>

                      <Field className="flex justify-between items-center">
                        <Label>Customer pay</Label>
                        <RHFTextCurrencyField
                          name="customerPay"
                          className="max-w-24"
                        />
                      </Field>

                      <Text className="mt-4 flex justify-between">
                        COD
                        <Strong>
                          {fCurrencyVND(
                            summaryBill.total - (values?.customerPay || 0),
                          )}
                        </Strong>
                      </Text>
                    </section>
                  )}
                </div>
              </div>

              <section
                aria-labelledby="summary-heading"
                className=" px-4 pt-16 pb-10 sm:px-6 lg:col-span-1 "
              >
                <div className="mx-auto lg:max-w-none mb-20 lg:mb-0">
                  <h2 id="summary-heading" className="text-lg font-medium ">
                    Order summary
                  </h2>

                  <ul
                    role="list"
                    className="divide-y divide-gray-200 border-t border-b border-gray-200 mt-6"
                  >
                    {values?.items?.map((item: any) => (
                      <li key={item._id} className="flex py-2 sm:py-4">
                        <div className="relative flex flex-1 flex-col justify-between ">
                          <div>
                            <div className="flex justify-between sm:grid sm:grid-cols-2">
                              <div className="pr-6">
                                <h3 className="text-sm line-clamp-1">
                                  <a className="font-medium">
                                    {item.productName}
                                  </a>
                                </h3>
                                <p className="mt-1 text-sm  dark:text-white/70">
                                  {fCurrencyVND(item.price)}{" "}
                                  <span className="text-xs font-bold">x</span>{" "}
                                  {item.quantity}
                                </p>
                              </div>

                              <p className="text-right text-sm font-medium">
                                {fCurrencyVND(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Popover className="fixed z-50 inset-x-0 bottom-20 flex flex-col-reverse text-sm font-medium  lg:hidden">
                    <div className="relative z-10 border-t border-gray-200 bg-white dark:bg-zinc-800 px-4 sm:px-6">
                      <div className="mx-auto max-w-lg">
                        <PopoverButton className="flex w-full items-center py-6 font-medium">
                          <span className="mr-auto text-base">Total</span>
                          <span className="mr-2 text-base">
                            {fCurrencyVND(summaryBill.total)}
                          </span>
                          <ChevronUpIcon
                            aria-hidden="true"
                            className="size-5 "
                          />
                        </PopoverButton>
                      </div>
                    </div>

                    <PopoverBackdrop
                      transition
                      className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
                    />
                    <PopoverPanel
                      transition
                      className="relative transform bg-white dark:bg-zinc-800 px-4 py-6 transition duration-300 ease-in-out data-closed:translate-y-full sm:px-6"
                    >
                      <dl className="mx-auto max-w-lg space-y-6">
                        <div className="flex items-center justify-between">
                          <dt className="">Subtotal</dt>
                          <dd>{fCurrencyVND(subTotal)}</dd>
                        </div>

                        <div className="flex items-center justify-between">
                          <dt className="-">Shipping</dt>
                          <dd>{fCurrencyVND(values.deliveryPrice)}</dd>
                        </div>

                        <div className="flex items-center justify-between">
                          <dt className="">
                            Taxes{" "}
                            <Badge color="zinc">
                              {ECOMMERCE_VARIABLES.taxRate * 100} %
                            </Badge>
                          </dt>
                          <dd>{fCurrencyVND(values.taxes)}</dd>
                        </div>

                        <div className="flex items-center justify-between">
                          <dt className="">
                            Discount
                            {/* <Badge color="zinc">
                                {ECOMMERCE_VARIABLES.taxRate * 100} %
                              </Badge> */}
                          </dt>
                          <dd>{fCurrencyVND(values.discount)}</dd>
                        </div>
                      </dl>
                    </PopoverPanel>
                  </Popover>
                </div>
              </section>
            </div>
          )}
        </Fieldset>
      </FormProvider>

      {/* Navigation Buttons */}
      <div className=" border-t border-gray-200 bg-white dark:bg-zinc-800 px-4 py-4 sm:px-6 lg:px-0 flex-none">
        <div className="mx-auto max-w-7xl flex  gap-4 sm:flex-row items-center justify-between">
          <div className="flex flex-row gap-3 items-center">
            <p className="text-sm ">
              Step {currentStepNumber} of {steps.length}
            </p>
            {!isEditing && currentStep === StepType.CHECKOUT && (
              <>
                {values.orderExport === OrderExport.QUICK ? (
                  <>
                    <Button color="blue">Quick</Button>
                    <Button
                      plain
                      onClick={() =>
                        setValue("orderExport", OrderExport.NORMAL)
                      }
                    >
                      Normal
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      plain
                      onClick={() => setValue("orderExport", OrderExport.QUICK)}
                    >
                      Quick
                    </Button>
                    <Button color="blue">Normal</Button>
                  </>
                )}
              </>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              color="white"
              onClick={handlePreviousStep}
              disabled={currentStep === StepType.ADD_ITEMS}
            >
              <ChevronLeftIcon className="size-4" />
              Back
            </Button>

            {currentStep !== StepType.CHECKOUT ? (
              <Button type="button" color="blue" onClick={handleNextStep}>
                {values.items?.length} Next
              </Button>
            ) : (
              <LoadingButton
                disabled={
                  methods.formState.isSubmitting || values.items?.length === 0
                }
                onClick={handleSubmit((data) => onSubmit(data))}
                isSubmitting={methods.formState.isSubmitting}
                type="submit"
              >
                Save
              </LoadingButton>
            )}
          </div>
        </div>
      </div>

      {/* Print Bill Dialog */}
      {showPrintBill && submittedOrderData && (
        <PrintBill
          orderData={submittedOrderData}
          onClose={() => {
            setShowPrintBill(false);
            setSubmittedOrderData(null);
          }}
        />
      )}
    </div>
  );
}

export function PayCashHelper({ totalAmount }: { totalAmount: number }) {
  const [value, setValue] = useState<number | "">(totalAmount);

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value.replace(/,/g, "");
    if (/^\d*\.?\d*$/.test(raw)) {
      const newPrice = parseFloat(raw === "" ? "" : raw);
      setValue(newPrice);
    }
  };

  const formatValue = formatInputNumber(value?.toString());
  const returnCash = +value - totalAmount;

  return (
    <>
      <div className="flex items-center justify-between">
        <dt className="">Customer Pay </dt>
        <dd>
          <InputComponent
            value={formatValue}
            onChange={handleOnChange}
            className="max-w-24"
          />
        </dd>
      </div>
      <div className="flex items-center justify-between">
        <dt className="">Return Cash </dt>
        <dd>- {fCurrencyVND(returnCash)}</dd>
      </div>
    </>
  );
}
