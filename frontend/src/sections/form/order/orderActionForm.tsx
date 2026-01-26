"use client";
import { use, useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormProvider, RHFTextField, RHFComboBox } from "@/hooks/RectHookForm";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  Item,
  OrderStatus,
  useOrderUpdateStatus,
  Order,
  StatusColor,
} from "@/hooks/useOrders";
import { useRouter } from "next/navigation";
import _, { capitalize } from "lodash";
import { fCurrencyVND } from "@/utils/format-number";
import { LoadingButton } from "@/components/loading";
import { Fieldset, Label } from "@/components/fieldset";
import UseImage from "@/hooks/useImage";
import { Button } from "@/components/button";
import { getLocation } from "@/utils/getLocation";
import {
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
} from "@/components/description-list";
import { Badge } from "@/components/badge";
import { fDate } from "@/utils/format-time";
import { ModalLayout } from "@/components/modal";
import { DialogActions } from "@/components/dialog";
import { Heading } from "@/components/heading";
import { Strong, Text } from "@/components/text";

interface FormValuesProps {
  _id: string;
  items: Item[];
  status: OrderStatus;
}

type Props = {
  currentData?: Order;
  submitStatus: OrderStatus;
  cancelStatus: OrderStatus;
  statusArray: OrderStatus[];
};

export default function OrderActionForm({
  currentData,
  submitStatus,
  cancelStatus,
  statusArray,
}: Props) {
  const router = useRouter();

  const defaultValues = useMemo(
    () => ({
      _id: currentData?._id || "",
      items: currentData?.items || [],
      status: currentData?.status || OrderStatus.PENDING,
    }),
    [currentData],
  );

  const schema = Yup.object().shape({
    // cart
    _id: Yup.string().required(),
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
    status: Yup.mixed<OrderStatus>().required(),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (currentData) {
      methods.reset({
        _id: currentData?._id || "",
        items: currentData?.items || [],
        status: currentData?.status || OrderStatus.PENDING,
      });
    }
  }, [currentData]);

  const { handleSubmit, reset } = methods;
  const mutationNotConfirm = useOrderUpdateStatus(
    OrderStatus.CANCELLED,
    "submit",
    statusArray,
  );
  const mutationSave = useOrderUpdateStatus(
    submitStatus,
    "submit",
    statusArray,
  );
  const mutationSaveExport = useOrderUpdateStatus(
    OrderStatus.EXPORTED,
    "submit",
    statusArray,
  );
  const mutationCancel = useOrderUpdateStatus(
    cancelStatus,
    "cancel",
    statusArray,
  );

  const onNotConfirm = async (data: FormValuesProps) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    try {
      await mutationNotConfirm?.mutateAsync(data._id as string);
      router.back();
    } catch (error) {}
  };

  const onSubmit = async (data: FormValuesProps) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    try {
      await mutationSave?.mutateAsync(data._id as string);
      router.back();
    } catch (error) {}
  };

  const onExport = async (data: FormValuesProps) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    try {
      await mutationSaveExport?.mutateAsync(data._id as string);
      router.back();
    } catch (error) {}
  };

  const onCancel = async (data: FormValuesProps) => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate async operation
    try {
      const result = await mutationCancel?.mutateAsync(data._id as string);
      reset({ items: result?.items, status: result?.status, _id: result?._id });
    } catch (error) {}
  };

  // useFieldArray for items
  const { fields, update } = useFieldArray({
    control: methods.control,
    name: "items",
  });

  const handleOnCheck = async (index: number, _id: string) => {
    update(index, {
      ...fields[index],
      status: submitStatus,
    });
  };

  const handleOnUncheck = async (index: number, _id: string) => {
    update(index, {
      ...defaultValues.items[index],
    });
  };

  const disableSubmit = fields.some(
    (item: any) => item.status !== submitStatus,
  );

  //
  const shippingAddress = getLocation(
    currentData?.province || "",
    currentData?.ward || "",
  );

  return (
    <ModalLayout size="5xl" dialogTitle={`${capitalize(submitStatus)} Order`}>
      <FormProvider
        methods={methods}
        //onSubmit={handleSubmit(onSubmit)}
        className="flex-1 flex flex-col overflow-auto mt-6 px-2"
      >
        <Fieldset>
          {/* Step 2: Cart Summary */}
          <div className="flex flex-1 flex-col  mx-auto max-w-7xl overflow-y-auto">
            <section
              aria-labelledby="contact-info-heading"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-1">
                <Heading
                  id="contact-info-heading"
                  className="text-lg font-medium  flex justify-between items-center mb-4"
                >
                  <span>Order Information</span>{" "}
                </Heading>

                <div className="grid select-text grid-col-1  gap-6   bg-gray-50 dark:bg-gray-800 p-4 rounded">
                  <DescriptionList>
                    <DescriptionTerm>Type</DescriptionTerm>
                    <DescriptionDetails>
                      {currentData?.orderType}
                    </DescriptionDetails>
                    <DescriptionTerm>Tracking Number</DescriptionTerm>
                    <DescriptionDetails>
                      {currentData?.trackingNumber}
                    </DescriptionDetails>

                    <DescriptionTerm>Created At</DescriptionTerm>
                    <DescriptionDetails>
                      {fDate(currentData?.createdAt)}
                    </DescriptionDetails>
                  </DescriptionList>
                </div>
              </div>

              <div className="md:col-span-2">
                <Heading
                  id="contact-info-heading"
                  className="text-lg font-medium  flex justify-between items-center mb-4"
                >
                  <span>Contact Information</span>{" "}
                </Heading>

                <div className="grid select-text grid-col-1 md:grid-cols-2 gap-6   bg-gray-50 dark:bg-gray-800 p-4 rounded">
                  <DescriptionList>
                    <DescriptionTerm>Customer Name</DescriptionTerm>
                    <DescriptionDetails>
                      {currentData?.customerName}
                    </DescriptionDetails>
                    <DescriptionTerm>Phone</DescriptionTerm>
                    <DescriptionDetails>
                      {currentData?.customerPhone}
                    </DescriptionDetails>

                    <DescriptionTerm>Email</DescriptionTerm>
                    <DescriptionDetails>
                      {currentData?.customerEmail}
                    </DescriptionDetails>
                  </DescriptionList>
                  <DescriptionList>
                    <DescriptionTerm>Address</DescriptionTerm>
                    <DescriptionDetails>
                      {currentData?.address}
                    </DescriptionDetails>
                    <DescriptionTerm>Ward</DescriptionTerm>
                    <DescriptionDetails>
                      {shippingAddress?.wardName}
                    </DescriptionDetails>
                    <DescriptionTerm>Province</DescriptionTerm>
                    <DescriptionDetails>
                      {shippingAddress?.provinceName}
                    </DescriptionDetails>
                  </DescriptionList>
                </div>
              </div>

              <div className="md:col-span-3">
                <Heading
                  id="contact-info-heading"
                  className="text-lg font-medium  flex justify-between items-center mb-4"
                >
                  <span>Payment Information</span>{" "}
                </Heading>
                <div className="grid select-text grid-col-1 md:grid-cols-2 gap-6   bg-gray-50 dark:bg-gray-800 p-4 rounded">
                  {/* {payment-info} */}
                  <DescriptionList>
                    <DescriptionTerm>Total Amount</DescriptionTerm>
                    <DescriptionDetails>
                      {fCurrencyVND(currentData?.totalAmount || 0)}
                    </DescriptionDetails>

                    <DescriptionTerm>Customer Pay</DescriptionTerm>
                    <DescriptionDetails>
                      {fCurrencyVND(currentData?.customerPay || 0)}
                    </DescriptionDetails>
                    <DescriptionTerm>Customer Pay Cod</DescriptionTerm>
                    <DescriptionDetails>
                      {fCurrencyVND(currentData?.customerPayCod || 0)}
                    </DescriptionDetails>
                  </DescriptionList>
                  <DescriptionList>
                    <DescriptionTerm>Status</DescriptionTerm>
                    <DescriptionDetails>
                      <Badge
                        color={
                          StatusColor[
                            currentData?.status.toUpperCase() as keyof typeof StatusColor
                          ] as any
                        }
                      >
                        {currentData?.status}
                      </Badge>
                    </DescriptionDetails>
                    <DescriptionTerm>Paid</DescriptionTerm>
                    <DescriptionDetails>
                      <Badge
                        color={
                          currentData?.paymentStatus === "paid"
                            ? "green"
                            : "yellow"
                        }
                      >
                        {currentData?.paymentStatus}
                      </Badge>
                    </DescriptionDetails>
                    <DescriptionTerm>Note</DescriptionTerm>
                    <DescriptionDetails>
                      {currentData?.notes}
                    </DescriptionDetails>
                  </DescriptionList>
                </div>
              </div>
            </section>
            <section aria-labelledby="summary-heading" className="grow ">
              <Heading
                id="summary-heading"
                className="text-lg font-medium text-gray-900 mt-6 "
              >
                Cart Items{" "}
              </Heading>

              {fields.length === 0 ? (
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
                </div>
              ) : (
                <ul
                  role="list"
                  className="divide-y divide-gray-200 border-gray-200 "
                >
                  {fields.map((item: any, idx: number) => (
                    <li key={item._id} className="flex py-2 sm:py-4">
                      <div className="shrink-0">
                        <UseImage
                          alt={item.name}
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
                              <Text className="text-sm mt-2">
                                <Strong className="font-medium">
                                  {item.productName}
                                </Strong>
                              </Text>
                              <Text className="mt-2 text-sm text-gray-500 dark:text-white/70">
                                {fCurrencyVND(item.price)} x{" "}
                                {item.quantity}{" "}
                              </Text>
                            </div>

                            <Text className="text-right text-sm font-medium">
                              {item.status === cancelStatus && (
                                <Button
                                  onClick={() => handleOnCheck(idx, item._id)}
                                  color="orange"
                                >
                                  Check
                                </Button>
                              )}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </Fieldset>
      </FormProvider>

      {/* inset bottom */}
      <DialogActions>
        <div className=" flex  gap-4 sm:flex-row items-center justify-between">
          <div className="flex flex-row gap-3 items-center">
            {currentData?.status === submitStatus && (
              <LoadingButton
                isSubmitting={methods.formState.isSubmitting}
                type="button"
                color="orange"
                onClick={handleSubmit((data) => onCancel(data))}
                className="capitalize"
              >
                Cancel {currentData?.status}
              </LoadingButton>
            )}
          </div>

          <div className="flex gap-4">
            {currentData?.status === OrderStatus.PENDING && (
              <LoadingButton
                isSubmitting={methods.formState.isSubmitting}
                onClick={handleSubmit((data) => onNotConfirm(data))}
                color="orange"
                type="button"
              >
                <XMarkIcon /> Not Confirm
              </LoadingButton>
            )}

            {currentData?.status === OrderStatus.CANCELLED &&
              mutationCancel && (
                <LoadingButton
                  isSubmitting={methods.formState.isSubmitting}
                  onClick={handleSubmit((data) => onSubmit(data))}
                  color="blue"
                  type="button"
                >
                  Confirm
                </LoadingButton>
              )}
            {currentData?.status === cancelStatus && mutationSave && (
              <LoadingButton
                isSubmitting={methods.formState.isSubmitting}
                onClick={handleSubmit((data) => onSubmit(data))}
                color="blue"
                type="button"
                className="capitalize"
                disabled={disableSubmit}
              >
                {submitStatus}
              </LoadingButton>
            )}

            {/* {mutationSaveExport &&
              currentData?.status !== OrderStatus.EXPORTED && (
                <LoadingButton
                  isSubmitting={methods.formState.isSubmitting}
                  onClick={handleSubmit((data) => onExport(data))}
                  color="blue"
                  type="button"
                  className="capitalize"
                >
                  Export
                </LoadingButton>
              )} */}
          </div>
        </div>
      </DialogActions>
    </ModalLayout>
  );
}
