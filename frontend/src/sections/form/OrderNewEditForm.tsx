"use client";
import { Suspense, useEffect, useMemo, useState, useTransition } from "react";
import * as Yup from "yup";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormProvider,
  RHFTextField,
  RHFTextCurrencyField,
  RHFSelectField,
  RHFTextAreaField,
} from "@/hooks/RectHookForm";
import vietNamLocation from "@/mock/provinces_and_wards_full.json";
import { PlusIcon, MinusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  useCancelExportedOrder,
  useCreateOrder,
  useOrderUpdateStatus,
  useUpdateOrder,
} from "@/hooks/useOrders";
import { useRouter } from "next/navigation";
import _ from "lodash";
import { fCurrencyVND } from "@/utils/format-number";
import { ECOMMERCE_VARIABLES } from "@/config-global";
import { Badge } from "@/components/badge";
import clsx from "clsx";
import { LoadingButton, LoadingScreen } from "@/components/loading";
import { Field, Fieldset, Label } from "@/components/fieldset";
import { ProductGridListModal } from "../list/product-list";
import { Button } from "@/components/button";
import paths from "@/router/path";
import { Strong, Text } from "@/components/text";
import { PrintBill } from "@/components/PrintBill";
import { BoxLabel } from "@/components/box";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { CustomerFindNewEditForm } from "./CustomerNewEditForm";
import { Customer } from "@/types/customer";
import {
  Order,
  DeliveryMethod,
  Item,
  OrderExport,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  deliveryMethods,
  OrderDto,
  paymentMethods,
} from "@/types/order";
import { useCartStore } from "@/store/cart";
import axiosInstance from "@/utils/axios";

export interface OrderFormValuesProps extends OrderDto {}

type Props = {
  orderType?: OrderType;
  orderExport?: OrderExport;
  currentData?: Order;
  changeStatus?: boolean;
};

export default function OrderNewEditForm({
  orderType = OrderType.IN_STORE,
  orderExport = OrderExport.QUICK,
  currentData = undefined,
  changeStatus = false,
}: Props) {
  const router = useRouter();
  const isEditing = !!currentData;
  // permissions & mutations
  const createMutation = useCreateOrder();
  const updateMutation = useUpdateOrder();
  const [showPrintBill, setShowPrintBill] = useState(false);
  const [submittedOrderData, setSubmittedOrderData] = useState<Order | null>(
    null,
  );

  const defaultValues = useMemo(
    () => ({
      orderType: currentData?.orderType || orderType,
      orderExport: currentData?.orderExport || orderExport,
      trackingNumber: currentData?.trackingNumber || "",
      status: currentData?.status || OrderStatus.PENDING,
      notes: currentData?.notes || "",
      items: currentData?.items || [],
      // customer info
      customer: currentData?.customer?._id || "",
      billing: currentData?.billing || {
        subTotal: 0,
        deliveryPrice: 0,
        discount: 0,
        totalAmount: 0,
        customerPay: 0,
        customerPayCod: 0,
      },
      // payment method
      payment: currentData?.payment || {
        paymentMethod: PaymentMethod.CASH,
        paymentStatus: PaymentStatus.UNPAID,
        paymentCardNumber: "",
        paymentCode: "",
      },
      // // delivery info
      delivery: currentData?.delivery || {
        deliveryMethod: DeliveryMethod.NONE,
        province: "",
        ward: "",
        address: "",
        receiptPhone: "",
        receiptName: "",
        receiptEmail: "",
        receiptNote: "",
      },
      exported: currentData?.exported || false,
    }),
    [currentData],
  );

  const schema = Yup.object().shape({
    orderType: Yup.mixed<OrderType>().required(),
    orderExport: Yup.mixed<OrderExport>().required(),
    trackingNumber: Yup.string(),
    status: Yup.mixed<OrderStatus>().required(),
    notes: Yup.string(),
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
    // customer info
    customer: Yup.string(),
    // billing
    billing: Yup.object()
      .shape({
        subTotal: Yup.number().min(0).required(),
        deliveryPrice: Yup.number().min(0).required(),
        discount: Yup.number().min(0).required(),
        totalAmount: Yup.number().min(0).required(),
        customerPay: Yup.number().min(0).required(),
        customerPayCod: Yup.number().min(0).required(),
      })
      .required(),
    // payment
    payment: Yup.object()
      .shape({
        paymentMethod: Yup.mixed<PaymentMethod>().required(),
        paymentStatus: Yup.mixed<PaymentStatus>().required(),
        paymentCardNumber: Yup.string().when("paymentMethod", {
          is: PaymentMethod.ETRANSFER,
          then: (schema) => schema.required("Card number is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        paymentCode: Yup.string(),
      })
      .required(),

    delivery: Yup.object()
      .shape({
        deliveryMethod: Yup.mixed<DeliveryMethod>(),
        province: Yup.string(),
        ward: Yup.string(),
        address: Yup.string(),
        receiptPhone: Yup.string(),
        receiptNote: Yup.string(),
        receiptName: Yup.string(),
        receiptEmail: Yup.string(),
      })
      .test("delivery-info-required", function (value) {
        // If order type is delivery, then delivery info is required
        const { orderType } = this.parent;
        if (orderType === OrderType.DELIVERY) {
          // Check if all required delivery fields are filled
          if (
            !value?.province ||
            !value?.ward ||
            !value?.address ||
            !value?.receiptPhone ||
            !value?.receiptName ||
            !value?.receiptEmail
          ) {
            return this.createError({
              message: "Delivery information is required for delivery orders",
            });
          }
        }
        return true;
      }),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const values = methods.watch();

  useEffect(() => {
    methods.reset();
  }, [currentData]);

  const { handleSubmit, setError } = methods;

  const handleOnClosePrintBill = () => {
    setShowPrintBill(false);
    setSubmittedOrderData(null);
    methods.reset();
  };

  const onSubmit = async (data: OrderFormValuesProps) => {
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

  useEffect(() => {
    methods.reset({ ...defaultValues });
  }, [currentData]);

  if (!values) return null;

  return (
    <div className="fixed z-50 inset-0 flex flex-1 flex-col top-0 min-w-screen h-screen justify-center overflow-hidden">
      <div className="border-b flex-none border-gray-200 bg-white dark:bg-zinc-800 z-50 p-3 sm:px-6 lg:px-0">
        <section className="mx-auto max-w-7xl ">
          <div className="flex justify-between flex-row-reverse items-center">
            <div className="flex flex-row items-center gap-3">
              <Button
                onClick={() => router.back()}
                plain
                className="justify-end-safe"
              >
                <XMarkIcon />
              </Button>
            </div>

            <div className="flex flex-row invisible "></div>
          </div>
        </section>
      </div>
      <FormProvider
        methods={methods}
        className="flex-1 flex flex-col overflow-auto"
      >
        <Fieldset>
          <div className="grid grid-cols-1 lg:grid-cols-3 pt-4 gap-x-4 gap-y-10 mx-auto max-w-7xl overflow-hidden ">
            {/* {left Thông Tin Giỏ Hàng} */}
            <BoxLabel
              label="Thông Tin Giỏ Hàng"
              className="flex flex-1 flex-col lg:col-span-2 px-0"
            >
              <div>
                {!changeStatus && (
                  <Suspense fallback={<div>Loading...</div>}>
                    <ProductGridListModal />
                  </Suspense>
                )}
                <CartTableForm />
              </div>
            </BoxLabel>
            {/* {right} */}
            <div className=" lg:col-span-1 lg:px-0 lg:pb-16 flex flex-col gap-4">
              <CustomerInfoForm
                isEditing={isEditing}
                currentCus={currentData?.customer}
              />
              <BillingSummary isEditing={isEditing} />
              {currentData?._id && <UpdateOrderStatus id={currentData._id} />}
            </div>
          </div>
        </Fieldset>
      </FormProvider>

      {/* Navigation Buttons */}
      <div className=" border-t border-gray-200 bg-white dark:bg-zinc-800 px-2 py-2 sm:px-6 lg:px-0 flex-none">
        <div className="mx-auto max-w-7xl flex  gap-4 sm:flex-row items-center justify-between">
          <div className="flex flex-row gap-3 items-center invisible" />

          <div className="flex gap-4">
            <LoadingButton
              disabled={
                methods.formState.isSubmitting ||
                values.items?.length === 0 ||
                isEditing
              }
              onClick={handleSubmit((data) => onSubmit(data))}
              isSubmitting={methods.formState.isSubmitting}
              type="submit"
            >
              Thanh Toán
            </LoadingButton>
          </div>
        </div>
      </div>

      {/* Print Bill Dialog */}
      {showPrintBill && submittedOrderData && (
        <PrintBill
          orderData={submittedOrderData}
          onClose={() => {
            handleOnClosePrintBill();
          }}
        />
      )}
    </div>
  );
}

export function CustomerInfoForm({
  isEditing,
  currentCus,
}: {
  isEditing?: boolean;
  currentCus?: Customer;
}) {
  const setValue = useFormContext<OrderFormValuesProps>().setValue;
  const values = useFormContext<OrderFormValuesProps>().watch();
  // customer
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(currentCus || null);
  useEffect(() => {
    setValue("customer", customer?._id || "");
  }, [customer, currentCus]);

  useEffect(() => {
    if (values.customer === "") {
      setCustomer(null);
    }
  }, [values.customer]);

  const onSetCustomer = (customerData: Customer) => {
    setCustomer(customerData);
    setValue("customer", customerData?._id || "");
    setOpenCustomerModal(false);
  };
  const onUnsetCustomer = () => {
    setCustomer(null);
    setValue("customer", "");
    onUnsetDelivery();
  };

  const onUnsetDelivery = () => {
    setValue("orderType", OrderType.IN_STORE);
    setValue("billing.deliveryPrice", 0);
    setValue("delivery", {
      deliveryMethod: DeliveryMethod.NONE,
      province: "",
      ward: "",
      address: "",
      receiptName: "",
      receiptEmail: "",
      receiptPhone: "",
      receiptNote: "",
    });
  };

  if (isEditing) {
    return (
      <BoxLabel label="Khách hàng" className="pt-6">
        {currentCus && (
          <div className="mb-4">
            <Text className="flex justify-between items-center ">
              <span>
                Tên KH: <Strong> {currentCus?.firstName || ""}</Strong>
              </span>

              <Button
                plain
                onClick={onUnsetCustomer}
                className="text-right"
                disabled={true}
              >
                <XMarkIcon />
              </Button>
            </Text>
            <Text>
              Phone: <Strong> {currentCus?.phone || ""}</Strong>
            </Text>
            <Text>
              Email: <Strong> {currentCus?.email || ""}</Strong>
            </Text>
          </div>
        )}

        <DeliveryForm orderType={values.orderType} customer={currentCus} />
      </BoxLabel>
    );
  }

  return (
    <BoxLabel label="Khách hàng">
      {!customer ? (
        <Button
          disabled={isEditing}
          onClick={() => {
            setOpenCustomerModal(true);
          }}
          color="teal"
          className="mt-2"
        >
          <PlusIcon /> Thêm Khách hàng
        </Button>
      ) : (
        customer && (
          <>
            <div className="mb-4">
              <Text className="flex justify-between items-center">
                <span>
                  Tên KH: <Strong> {customer?.firstName || ""}</Strong>
                </span>
                <Button plain onClick={onUnsetCustomer} className="text-right">
                  <XMarkIcon />
                </Button>
              </Text>
              <Text>
                Phone: <Strong> {customer?.phone || ""}</Strong>
              </Text>
              <Text>
                Email: <Strong> {customer?.email || ""}</Strong>
              </Text>
            </div>
            <DeliveryForm orderType={values.orderType} customer={customer} />
          </>
        )
      )}

      {openCustomerModal && (
        <CustomerFindNewEditForm
          onClose={() => setOpenCustomerModal(false)}
          setCustomerData={onSetCustomer}
        />
      )}
    </BoxLabel>
  );
}

export function CartTableForm() {
  const { control } = useFormContext<OrderFormValuesProps>();
  const { update, remove } = useFieldArray({
    control,
    name: "items",
  });
  const values = useFormContext<OrderFormValuesProps>().watch();

  return (
    <Table grid striped bleed dense>
      <TableHead>
        <TableRow>
          <TableHeader>Mặt hàng</TableHeader>
          <TableHeader>Số lượng</TableHeader>
          <TableHeader>Thành Tiền</TableHeader>

          <TableHeader className="max-w-10" />
        </TableRow>
      </TableHead>
      <TableBody>
        {values.items.map((item: Item, idx: number) => (
          <TableRow key={item?._id}>
            <TableCell>
              <Text> {item.productName}</Text>
              <Text>
                <Strong>{fCurrencyVND(item.price)}</Strong>
              </Text>
            </TableCell>

            <TableCell className="flex flex-row gap-2 items-center">
              <Button
                plain
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

              {item.quantity}

              <Button
                plain
                onClick={() =>
                  update(idx, {
                    ...item,
                    quantity: item.quantity + 1,
                  })
                }
              >
                <PlusIcon />
              </Button>
            </TableCell>
            <TableCell>{fCurrencyVND(item.price * item.quantity)}</TableCell>

            <TableCell>
              <Button plain onClick={() => remove(idx)}>
                <XMarkIcon />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function BillingSummary({ isEditing }: { isEditing?: boolean }) {
  const values = useFormContext<OrderFormValuesProps>().watch();
  const setValue = useFormContext<OrderFormValuesProps>().setValue;
  useEffect(() => {
    let billing = {
      subTotal: 0,
      deliveryPrice: 0,
      discount: values.billing.discount || 0,
      totalAmount: 0,
      customerPay: 0,
      customerPayCod: 0,
    };
    billing.subTotal = values.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    billing.totalAmount = billing.subTotal - billing.discount;

    // delivery price adjustment
    if (
      values.orderType === OrderType.DELIVERY ||
      values.orderType === OrderType.WEBSITE
    ) {
      if (
        billing.subTotal > ECOMMERCE_VARIABLES.freeShippingWhenSubtotalExceeds
      ) {
        // free shipping if subtotal exceeds threshold
        billing.deliveryPrice = 0;
      } else {
        // else calculate delivery price based on selected delivery method
        const selectedDeliveryMethod = deliveryMethods.find(
          (method) => method.id === values?.delivery?.deliveryMethod,
        );

        billing.deliveryPrice = selectedDeliveryMethod
          ? selectedDeliveryMethod.price
          : 0;
      }
    }

    billing.totalAmount += billing.deliveryPrice;
    billing.customerPay = billing.totalAmount;
    billing.customerPayCod = billing.totalAmount - billing.customerPay;

    if (isEditing) return;
    setValue("billing", billing);
  }, [values.items, values.billing.discount, values.delivery?.deliveryMethod]);

  useEffect(() => {
    //useEffect to update customerPayCod when totalAmount changes and CustomerPay
    if (values.orderType === OrderType.DELIVERY && !isEditing) {
      if (values.billing.customerPay < values.billing.totalAmount) {
        setValue(
          "billing.customerPayCod",
          values.billing.totalAmount - values.billing.customerPay,
        );
      }
    }
  }, [values.billing.totalAmount, values.billing.customerPay]);
  return (
    <BoxLabel label="Thanh Toán">
      <dl className="  space-y-4  pt-6 text-sm font-medium  ">
        <div className="flex items-center justify-between">
          <dt className="">Thành tiền</dt>
          <dd>{fCurrencyVND(values.billing.subTotal)}</dd>
        </div>

        {(values.orderType === OrderType.DELIVERY ||
          values.orderType === OrderType.WEBSITE) && (
          <div className="flex items-center justify-between">
            <dt className="">Phí vận chuyển</dt>
            <dd className="space-x-2">
              <span
                className={clsx(
                  values.billing.subTotal >
                    ECOMMERCE_VARIABLES.freeShippingWhenSubtotalExceeds &&
                    "line-through",
                )}
              >
                {fCurrencyVND(values.billing.deliveryPrice)}
              </span>
            </dd>
          </div>
        )}

        <div className="flex items-center justify-between">
          <dt className="">Giảm giá </dt>
          <dd>{fCurrencyVND(values.billing.discount)}</dd>
        </div>

        <div className="flex items-baseline justify-between border-t border-gray-200 pt-6">
          <dt className="text-base">Tổng cộng </dt>
          <dd className="text-base">
            {isEditing && (
              <Badge
                color={
                  values.payment.paymentStatus === PaymentStatus.PAID
                    ? "green"
                    : "yellow"
                }
              >
                {values.payment.paymentStatus}
              </Badge>
            )}
            {fCurrencyVND(values.billing.totalAmount)}
          </dd>
        </div>

        {values.orderType === OrderType.IN_STORE && (
          <>
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <dt className="text-base">Khách thanh toán </dt>
              <dd className="text-base">
                <RHFTextCurrencyField
                  name="billing.customerPay"
                  className="max-w-24"
                />
              </dd>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <dt className="text-base">Tiền trả lại </dt>
              <dd className="text-base">
                {fCurrencyVND(
                  values.billing.totalAmount -
                    (values.billing.customerPay || 0),
                )}
              </dd>
            </div>
          </>
        )}
      </dl>

      <BoxLabel label="Hình thức thanh toán" className="mt-6">
        <fieldset className="mt-4">
          <legend className="sr-only">Payment type</legend>
          <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
            {paymentMethods.map((paymentMethod) => (
              <div key={paymentMethod.id} className="flex items-center">
                <input
                  disabled={values.payment.paymentStatus === PaymentStatus.PAID}
                  onChange={() => {
                    setValue("payment.paymentMethod", paymentMethod.id as any);
                  }}
                  defaultChecked={
                    paymentMethod.id === values.payment.paymentMethod
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

        <div className="mt-4 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
          {values.payment.paymentMethod === PaymentMethod.ETRANSFER && (
            <div className="col-span-3 sm:col-span-4">
              <div className="mt-2">
                <RHFTextField name="paymentCardNumber" label="Card number" />
              </div>
            </div>
          )}
        </div>

        {values.orderType === OrderType.DELIVERY && (
          <>
            <h2 id="payment-heading" className="text-md font-medium ">
              Thu hộp COD
            </h2>

            <fieldset className="mt-4">
              <legend className="sr-only">Chi tiết COD</legend>
              <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10"></div>
            </fieldset>

            <Field className="flex justify-between items-center">
              <Label>Customer pay</Label>
              <RHFTextCurrencyField
                name="billing.customerPay"
                className="max-w-24"
              />
            </Field>

            <Text className="mt-4 flex justify-between">
              COD
              <Strong>
                {fCurrencyVND(
                  values.billing.totalAmount -
                    (values.billing.customerPay || 0),
                )}
              </Strong>
            </Text>
          </>
        )}
      </BoxLabel>
    </BoxLabel>
  );
}

export function DeliveryForm({
  orderType,
  customer,
}: {
  orderType: OrderType;
  customer?: Customer;
}) {
  const {
    formState: { errors },
  } = useFormContext();
  const values = useFormContext<OrderFormValuesProps>().watch();
  const setValue = useFormContext<OrderFormValuesProps>().setValue;
  // provinces
  // useMemo provinceList
  const { provinces, table } = vietNamLocation;
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
      (provinces as Record<string, any>)[values?.delivery?.province as any] ?? {
        wards: [],
      },
    [provinces, values?.delivery?.province],
  );
  // delivery
  const onSetDelivery = () => {
    setValue("orderType", OrderType.DELIVERY);
    setValue("delivery", {
      deliveryMethod: DeliveryMethod.STANDARD,
      province: customer?.province || "",
      ward: customer?.ward || "",
      address: customer?.address || "",
      receiptName: customer
        ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
        : "",
      receiptEmail: customer?.email || "",
      receiptPhone: customer?.phone || "",
      receiptNote: "",
    });
  };

  const onUnsetDelivery = () => {
    setValue("orderType", OrderType.IN_STORE);
    setValue("billing.deliveryPrice", 0);
    setValue("delivery", {
      deliveryMethod: DeliveryMethod.NONE,
      province: "",
      ward: "",
      address: "",
      receiptPhone: "",
      receiptNote: "",
      receiptName: "",
      receiptEmail: "",
    });
  };

  const wardList = useMemo(() => {
    if (!selectedProvince) return [];
    return [
      { label: "Chọn phường/xã", value: "" },
      ...selectedProvince.wards.map((ward: any) => ({
        label: ward.name,
        value: ward.code,
      })),
    ];
  }, [selectedProvince]);

  if (values.orderType === OrderType.IN_STORE) {
    return (
      <Button onClick={onSetDelivery} color="teal">
        <PlusIcon /> Thêm địa chỉ giao hàng
      </Button>
    );
  }
  return (
    <BoxLabel label="Thông Tin giao hàng" className="space-y-2 ">
      <RHFSelectField
        className="flex flex-row gap-2 items-baseline [&>*:first-child]:w-1/2 "
        name="delivery.province"
        label="Tỉnh/Thành phố"
        required
        options={provinceList}
      />

      <RHFSelectField
        className="flex flex-row gap-2 items-baseline [&>*:first-child]:w-1/2"
        name="delivery.ward"
        label="Phường/Xã"
        required
        options={wardList}
      />

      <RHFTextField
        className="flex flex-row gap-2 items-baseline [&>*:first-child]:w-1/2"
        name="delivery.address"
        label="Địa chỉ"
        required
        autoComplete="address"
      />

      <RHFTextField
        className="flex flex-row justify-between gap-2 items-baseline [&>*:first-child]:w-1/2"
        name="delivery.receiptName"
        label="Tên người nhận"
        required
        autoComplete="name"
      />

      <RHFTextField
        className="flex flex-row justify-between gap-2 items-baseline [&>*:first-child]:w-1/2"
        name="delivery.receiptPhone"
        label="SĐT người nhận"
        required
        autoComplete="tel"
      />

      <RHFTextField
        className="flex flex-row justify-between gap-2 items-baseline [&>*:first-child]:w-1/2"
        name="delivery.receiptEmail"
        label="Email người nhận"
        autoComplete="email"
      />

      <RHFTextAreaField
        className="flex flex-row justify-between gap-2 items-baseline [&>*:first-child]:w-1/2"
        name="delivery.receiptNote"
        label="ghi chú"
      />

      {orderType === OrderType.DELIVERY && (
        <Button className="text-right" plain onClick={onUnsetDelivery}>
          <XMarkIcon />
          Hủy giao hàng
        </Button>
      )}
    </BoxLabel>
  );
}

export function UpdateOrderStatus({ id }: { id: string }) {
  const methods = useFormContext<OrderFormValuesProps>();
  const {
    watch,
    handleSubmit,
    resetField,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();
  console.log(
    "🚀 ~ file: OrderNewEditForm.tsx:439 ~ UpdateOrderStatus ~ errors:",
    errors,
  );

  const onCancelled = useOrderUpdateStatus(OrderStatus.CANCELLED);
  const onConfirmed = useOrderUpdateStatus(OrderStatus.CONFIRMED);
  const onExported = useOrderUpdateStatus(OrderStatus.EXPORTED);
  const onDelivered = useOrderUpdateStatus(OrderStatus.DELIVERED);
  const onCompleted = useOrderUpdateStatus(OrderStatus.COMPLETED);
  const onCancelExported = useCancelExportedOrder();
  const router = useRouter();
  const exported = values.exported;

  const mutations: any = {
    [OrderStatus.CANCELLED]: onCancelled,
    [OrderStatus.CONFIRMED]: onConfirmed,
    [OrderStatus.EXPORTED]: onExported,
    [OrderStatus.DELIVERED]: onDelivered,
    [OrderStatus.COMPLETED]: onCompleted,
    ['cancel-exported']: onCancelExported,
  };

  const onSubmit = async (data: OrderFormValuesProps, action: any) => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
    try {
      const { _id, result } = await mutations[action]?.mutateAsync(id);
      reset({ ...result });
    } catch (error) {}
  };

  const CancelBtn = () => {
    if (!onCancelled) return null;
    if (values.status === OrderStatus.PENDING) {
      return (
        <LoadingButton
          color="red"
          isSubmitting={isSubmitting}
          onClick={() =>
            handleSubmit((data) => onSubmit(data, OrderStatus.CANCELLED))()
          }
        >
          Hủy đơn hàng
        </LoadingButton>
      );
    }
    if (values.status === OrderStatus.CANCELLED) {
      return (
        <LoadingButton
          color="yellow"
          isSubmitting={isSubmitting}
          onClick={() =>
            handleSubmit((data) => onSubmit(data, OrderStatus.PENDING))()
          }
        >
          Khôi phục đơn hàng
        </LoadingButton>
      );
    }
    return null;
  };

  const ConfirmBtn = () => {
    if (!onConfirmed) return null;
    if (values.status === OrderStatus.PENDING) {
      return (
        <LoadingButton
          color="indigo"
          isSubmitting={isSubmitting}
          onClick={() =>
            handleSubmit((data) => onSubmit(data, OrderStatus.CONFIRMED))()
          }
        >
          Xác nhận đơn hàng
        </LoadingButton>
      );
    }
    if (values.status === OrderStatus.CONFIRMED) {
      return (
        <LoadingButton
          color="yellow"
          isSubmitting={isSubmitting}
          onClick={() =>
            handleSubmit((data) => onSubmit(data, OrderStatus.PENDING))()
          }
        >
          Hủy xác nhận
        </LoadingButton>
      );
    }
    return null;
  };

  const ExportBtn = () => {
    if (!onExported) return null;
    if (values.status === OrderStatus.CONFIRMED) {
      return (
        <LoadingButton
          disabled={exported}
          color="emerald"
          isSubmitting={isSubmitting}
          onClick={() =>
            handleSubmit((data) => onSubmit(data, OrderStatus.EXPORTED))()
          }
        >
          Xuất kho
        </LoadingButton>
      );
    }
    if (values.status === OrderStatus.EXPORTED) {
      return (
        <LoadingButton
          color="yellow"
          isSubmitting={isSubmitting}
          onClick={() =>
            handleSubmit((data) => onSubmit(data, "cancel-exported"))()
          }
        >
          Hủy xuất kho
        </LoadingButton>
      );
    }
    return null;
  };

  const DeliveryBtn = () => {
    if (!onDelivered) return null;
    if (values.status === OrderStatus.EXPORTED) {
      return (
        <LoadingButton
          color="purple"
          isSubmitting={isSubmitting}
          onClick={() =>
            handleSubmit((data) => onSubmit(data, OrderStatus.DELIVERED))()
          }
        >
          Giao hàng
        </LoadingButton>
      );
    }
    if (values.status === OrderStatus.DELIVERED) {
      return (
        <LoadingButton
          color="yellow"
          isSubmitting={isSubmitting}
          onClick={() =>
            handleSubmit((data) => onSubmit(data, OrderStatus.EXPORTED))()
          }
        >
          Hủy giao hàng
        </LoadingButton>
      );
    }
    return null;
  };

  const CompleteBtn = () => {
    if (!onCompleted) return null;
    if (values.status === OrderStatus.DELIVERED) {
      return (
        <LoadingButton
          color="green"
          isSubmitting={isSubmitting}
          onClick={() =>
            handleSubmit((data) => onSubmit(data, OrderStatus.COMPLETED))()
          }
        >
          Hoàn Tất
        </LoadingButton>
      );
    }
    if (values.status === OrderStatus.COMPLETED) {
      return (
        <LoadingButton
          color="red"
          isSubmitting={isSubmitting}
          onClick={() =>
            handleSubmit((data) => onSubmit(data, OrderStatus.DELIVERED))()
          }
        >
          Hủy Hoàn Tất
        </LoadingButton>
      );
    }
    return null;
  };

  const CurrentStatus = () => {
    return (
      <Text>
        Trạng thái hiện tại:
        <Strong>{values.status} </Strong>
      </Text>
    );
  };

  // render
  if (values.orderType === OrderType.WEBSITE) {
    return (
      <BoxLabel
        label="Cập nhật trạng thái đơn web"
        className="flex flex-col  gap-2 pt-6"
      >
        <CurrentStatus />
        <ConfirmBtn />
        <CancelBtn />
        <ExportBtn />
        <DeliveryBtn />
        <CompleteBtn />
      </BoxLabel>
    );
  }
  if (values.orderType === OrderType.DELIVERY) {
    return (
      <BoxLabel
        label="Cập nhật trạng thái đơn giao hàng"
        className="flex flex-col gap-2 pt-6"
      >
        <CurrentStatus />
        <ExportBtn />
        <DeliveryBtn />
        <CompleteBtn />
      </BoxLabel>
    );
  }
  if (
    values.orderType === OrderType.IN_STORE &&
    values.orderExport === OrderExport.NORMAL
  ) {
    return (
      <BoxLabel
        label="Cập nhật trạng thái đơn tại cửa hàng"
        className="flex flex-col gap-2 pt-6"
      >
        <CurrentStatus />
        <CompleteBtn />
      </BoxLabel>
    );
  }
  return null;
}

export function OrderWebNewForm({
  orderType = OrderType.WEBSITE,
  orderExport = OrderExport.NORMAL,
  currentData = undefined,
}: Props) {
  const { items, clear } = useCartStore((s) => s);

  useEffect(() => {
    methods.setValue("items", items);
  }, [items]);

  const defaultValues = useMemo(
    () => ({
      orderType: currentData?.orderType || orderType,
      orderExport: currentData?.orderExport || orderExport,
      trackingNumber: currentData?.trackingNumber || "",
      status: currentData?.status || OrderStatus.PENDING,
      notes: currentData?.notes || "",
      items: currentData?.items || [],
      // customer info
      customer: currentData?.customer?._id || "",
      billing: currentData?.billing || {
        subTotal: 0,
        deliveryPrice: 0,
        discount: 0,
        totalAmount: 0,
        customerPay: 0,
        customerPayCod: 0,
      },
      // payment method
      payment: currentData?.payment || {
        paymentMethod: PaymentMethod.CASH,
        paymentStatus: PaymentStatus.UNPAID,
        paymentCardNumber: "",
        paymentCode: "",
      },
      // // delivery info
      delivery: currentData?.delivery || {
        deliveryMethod: DeliveryMethod.NONE,
        province: "79",
        ward: "",
        address: "",
        receiptPhone: "",
        receiptName: "",
        receiptEmail: "",
        receiptNote: "",
      },
    }),
    [currentData],
  );

  const schema = Yup.object().shape({
    orderType: Yup.mixed<OrderType>().required(),
    orderExport: Yup.mixed<OrderExport>().required(),
    trackingNumber: Yup.string(),
    status: Yup.mixed<OrderStatus>().required(),
    notes: Yup.string(),
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
    // customer info
    customer: Yup.string(),
    // billing
    billing: Yup.object()
      .shape({
        subTotal: Yup.number().min(0).required(),
        deliveryPrice: Yup.number().min(0).required(),
        discount: Yup.number().min(0).required(),
        totalAmount: Yup.number().min(0).required(),
        customerPay: Yup.number().min(0).required(),
        customerPayCod: Yup.number().min(0).required(),
      })
      .required(),
    // payment
    payment: Yup.object()
      .shape({
        paymentMethod: Yup.mixed<PaymentMethod>().required(),
        paymentStatus: Yup.mixed<PaymentStatus>().required(),
        paymentCardNumber: Yup.string().when("paymentMethod", {
          is: PaymentMethod.ETRANSFER,
          then: (schema) => schema.required("Card number is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
        paymentCode: Yup.string(),
      })
      .required(),

    delivery: Yup.object()
      .shape({
        deliveryMethod: Yup.mixed<DeliveryMethod>(),
        province: Yup.string(),
        ward: Yup.string(),
        address: Yup.string(),
        receiptPhone: Yup.string(),
        receiptNote: Yup.string(),
        receiptName: Yup.string(),
        receiptEmail: Yup.string(),
      })
      .test("delivery-info-required", function (value) {
        // If order type is delivery or website, then delivery info is required
        const { orderType } = this.parent;
        if (
          orderType === OrderType.DELIVERY ||
          orderType === OrderType.WEBSITE
        ) {
          // Check if all required delivery fields are filled
          if (
            !value?.province ||
            !value?.ward ||
            !value?.address ||
            !value?.receiptPhone ||
            !value?.receiptName ||
            !value?.receiptEmail
          ) {
            return this.createError({
              message:
                "Delivery information is required for delivery or website orders",
              path: "delivery.ward", // Set the error path to the delivery field
            });
          }
        }
        return true;
      }),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const values = methods.watch();

  if (!values) return null;
  const route = useRouter();
  const [isPending, startTransition] = useTransition();
  const onSubmit = async (data: OrderFormValuesProps) => {
    // const _id = uuidv7();
    startTransition(async () => {
      try {
        const response = await axiosInstance.post("/orders/public", {
          ...data,
          //_id,
        });
        clear();
        route.replace("/order-detail/" + response.data._id);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
      } catch (error) {
        console.error("Failed to create order:", error);
      }
    });

    // Handle form submission here (e.g., send to API)
  };

  if (isPending) {
    return <LoadingScreen />;
  }

  return (
    <FormProvider
      methods={methods}
      onSubmit={methods.handleSubmit(onSubmit)}
      className="flex-1 flex flex-col overflow-auto py-6"
    >
      <Fieldset>
        <div className="grid grid-cols-1 lg:grid-cols-3 pt-4 gap-x-4 gap-y-10 mx-auto max-w-7xl overflow-hidden ">
          {/* {left Thông Tin Giỏ Hàng} */}
          <BoxLabel
            label="Thông Tin Giỏ Hàng"
            className="flex flex-1 flex-col lg:col-span-2 px-0"
          >
            <CartTableForm />
          </BoxLabel>
          {/* {right} */}
          <div className=" lg:col-span-1 lg:px-0 lg:pb-16 flex flex-col gap-4">
            <DeliveryForm orderType={orderType} />
            <BillingSummary />
            <LoadingButton
              className="px-2 md:px-0"
              isSubmitting={methods.formState.isSubmitting}
              type="submit"
            >
              Thanh Toán
            </LoadingButton>
            <Button href={"/"}>Thêm mặt hàng</Button>
          </div>
        </div>
      </Fieldset>
    </FormProvider>
  );
}
