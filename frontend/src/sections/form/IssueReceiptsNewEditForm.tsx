"use client";
// React Hook Form
import * as Yup from "yup";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormProvider,
  RHFTextField,
  RHFCheckBoxField,
  RHFSelectField,
  RHFTextCurrencyField,
} from "@/hooks/RectHookForm";
import {
  useCreateIssueReceipt,
  useUpdateIssueReceipt,
  useDeleteIssueReceipt,
} from "@/hooks/useIssueReceipts";
import { useEffect, useMemo, useState } from "react";
import {
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "@/components/fieldset";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

import _, { set } from "lodash";
import { LoadingButton } from "@/components/loading";
import { Warehouse, CreateWarehouseDto } from "@/types/warehouse";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/button";
import {
  IssueReceipt,
  IssueReceiptItem,
  IssueReceiptDto as FormValuesProps,
  UpdateIssueReceiptDto,
} from "@/types/issueReceipt";
import { on } from "events";
import { useWarehouses } from "@/hooks/useWarehouses";
import { useProducts } from "@/hooks/useProducts";
import { Input } from "@/components/input";
import { PlusCircle } from "lucide-react";
import { Combobox, ComboboxLabel, ComboboxOption } from "@/components/combobox";
import { ModalLayout, ModalLayoutFullScreen } from "@/components/modal";
import { BoxLabel } from "@/components/box";
import { DialogActions } from "@/components/dialog";

const tabs = ["Bán nhanh", "Bán giao hàng"];

type Props = {
  currentData?: IssueReceipt;
};

const formattedMessage = language.inventory.issueReceipts;

export default function IssueReceiptsNewEditForm({ currentData }: Props) {
  const isEditing = !!currentData;
  // Mutations
  const createMutation = useCreateIssueReceipt();
  const updateMutation = useUpdateIssueReceipt();
  const deleteMutation = useDeleteIssueReceipt();

  const defaultValues = useMemo(
    () => ({
      customer: currentData?.customer?._id || "",
      warehouse: currentData?.warehouse?._id || "",
      note: currentData?.note || "",
      //status: currentData?.status || GoodsReceiptStatus.DRAFT,
      items:
        currentData?.items?.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          warehouse: item.warehouse,
        })) || [],
      // delivery
      deliveryNote: currentData?.deliveryNote || "",
      deliveryDate: currentData?.deliveryDate
        ? new Date(currentData.deliveryDate).toISOString().substring(0, 10)
        : "",
      deliveryPrice: currentData?.deliveryPrice || 0,
    }),
    [currentData],
  );

  const schema = Yup.object().shape({
    customer: Yup.string().optional(),
    warehouse: Yup.string().required("Kho là bắt buộc"),
    note: Yup.string().optional(),
    // status: Yup.mixed<GoodsReceiptStatus>()
    //   .oneOf(Object.values(GoodsReceiptStatus), "Trạng thái không hợp lệ")
    //   .required("Trạng thái là bắt buộc"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          product: Yup.object()
            .shape({
              _id: Yup.string().required("Sản phẩm là bắt buộc"),
              name: Yup.string().required(),
            })
            .required("Sản phẩm là bắt buộc"),
          quantity: Yup.number()
            .typeError("Số lượng phải là một số")
            .positive("Số lượng phải lớn hơn 0")
            .required("Số lượng là bắt buộc"),
          price: Yup.number()
            .typeError("Giá phải là một số")
            .min(0, "Giá phải lớn hơn hoặc bằng 0")
            .required("Giá là bắt buộc"),
          warehouse: Yup.object()
            .shape({
              _id: Yup.string().required("Kho nhập là bắt buộc"),
              name: Yup.string().required(),
            })
            .required("Kho nhập là bắt buộc"),
        }),
      )
      .min(1, "Phải có ít nhất một mặt hàng")
      .required("Mặt hàng là bắt buộc"),
    // deliveryNote: Yup.string().optional(),
    // deliveryDate: Yup.date()
    //   .typeError("Ngày giao hàng không hợp lệ")
    //   .optional(),
    // deliveryPrice: Yup.number()
    //   .typeError("Giá giao hàng phải là một số")
    //   .min(0, "Giá giao hàng phải lớn hơn hoặc bằng 0")
    //   .optional(),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    setError,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const router = useRouter();

  const onSubmit = async (data: FormValuesProps) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const formattedData = {
      ...data,
      items: data.items.map((item: any) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.price,
        warehouse: item.warehouse._id,
      })),
    };
    try {
      isEditing && currentData?._id
        ? await updateMutation?.mutateAsync({
            id: currentData._id,
            data: formattedData,
          })
        : await createMutation?.mutateAsync(formattedData);

      router.back();
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

  const values = methods.watch();

  useEffect(() => {
    reset();
  }, [currentData]);

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

      // total calculation if subtotal > freeShippingWhenSubtotalExceeds => free shipping
      total:
        subTotal +
        (subTotal > ECOMMERCE_VARIABLES.freeShippingWhenSubtotalExceeds
          ? 0
          : values.deliveryPrice || 0),
    }),
    [subTotal, values.deliveryPrice],
  );

  return (
    <FormProvider methods={methods}>
      <ModalLayoutFullScreen
        className="bg-zinc-100 lg:p-4 rounded-none overflow-hidden items-center lg:items-stretch"
        dialogTitle={formattedMessage.title}
      >
        <Fieldset
          className="grow flex flex-col lg:flex-row lg:gap-x-3 items-start overflow-hidden pt-4"
          disabled={isSubmitting}
        >
          {/* {thông tin nhập} */}
          <BoxLabel
            label="Thêm Mặt Hàng"
            className="bg-white dark:bg-zinc-800 p-4 rounded-md flex flex-1 flex-col h-full gap-3"
          >
            <ItemsForm />
          </BoxLabel>

          {/* {phiếu xuất column} */}
          <div className="basis-1/4 flex flex-col-reverse  items-stretch  min-h-full gap-4 ">
            <BoxLabel
              label="Thanh Toán"
              className="bg-white dark:bg-zinc-800 p-4 rounded-md flex flex-1 flex-col h-full gap-3"
              //className="bg-white dark:bg-zinc-800 p-4 flex-1 rounded-md flex flex-col h-full overflow-y-auto"
            >
              <TabGroup defaultIndex={0} className="">
                <div className="flex overflow-x-auto ">
                  <div className="flex-auto border-b border-gray-200 ">
                    <TabList className=" flex space-x-4">
                      {tabs.map((tab) => (
                        <Tab
                          key={tab}
                          className="border-b-2 border-transparent p-2 text-sm font-medium whitespace-nowrap text-gray-500 hover:border-gray-300 hover:text-gray-700 data-selected:border-blue-500 data-selected:text-blue-600"
                        >
                          {tab}
                        </Tab>
                      ))}
                    </TabList>
                  </div>
                </div>

                <TabPanels as={Fragment}>
                  <TabPanel id="quick" />
                  <TabPanel id="customer" className="lg:h-48 overflow-auto">
                    <RHFTextField
                      name="customer"
                      label="Mã Khách Hàng"
                      type="text"
                      className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-2 md:[&>*:nth-child(1)]:basis-auto md:[&>*:nth-child(2)]:basis-50"
                    />

                    <RHFTextField
                      name="customer"
                      label="Mã Khách Hàng"
                      type="text"
                      className="flex flex-row justify-between items-baseline gap-2 [&>*:nth-child(1)]:basis-auto [&>*:nth-child(2)]:basis-50"
                    />
                    <RHFTextField
                      name="customer"
                      label="Mã Khách Hàng"
                      type="text"
                      className="flex flex-row justify-between items-baseline gap-2 [&>*:nth-child(1)]:basis-auto [&>*:nth-child(2)]:basis-50"
                    />

                    <RHFTextField
                      name="customer"
                      label="Tên Khách Hàng"
                      type="text"
                      className="flex flex-row justify-between items-baseline gap-2 [&>*:nth-child(1)]:basis-auto [&>*:nth-child(2)]:basis-50"
                    />

                    <RHFTextField
                      name="customer"
                      label="Tên Khách Hàng"
                      type="text"
                      className="flex flex-row justify-between items-baseline gap-2 [&>*:nth-child(1)]:basis-auto [&>*:nth-child(2)]:basis-50"
                    />

                    <RHFTextField
                      name="customer"
                      label="Tên Khách Hàng"
                      type="text"
                      className="flex flex-row justify-between items-baseline gap-2 [&>*:nth-child(1)]:basis-auto [&>*:nth-child(2)]:basis-50"
                    />

                    <RHFTextField
                      name="customer"
                      label="Tên Khách Hàng"
                      type="text"
                      className="flex flex-row justify-between items-baseline gap-2 [&>*:nth-child(1)]:basis-auto [&>*:nth-child(2)]:basis-50"
                    />
                    <RHFTextField
                      name="customer"
                      label="Số Điện Thoại"
                      type="text"
                      className="flex flex-row justify-between items-baseline gap-2 [&>*:nth-child(1)]:basis-auto [&>*:nth-child(2)]:basis-50"
                    />
                    <RHFTextField
                      name="customer"
                      label="Địa Chỉ"
                      type="text"
                      className="flex flex-row justify-between items-baseline gap-2 [&>*:nth-child(1)]:basis-auto [&>*:nth-child(2)]:basis-50"
                    />

                    <RHFTextField
                      name="note"
                      label="Ghi Chú"
                      type="text"
                      className="flex flex-row items-baseline gap-2"
                    />
                  </TabPanel>
                  <TabPanel id="delivery">123</TabPanel>
                </TabPanels>
              </TabGroup>

              <Divider />
              <Legend className="text-sm font-medium">
                Thông Tin Thanh Toán
              </Legend>

              <dl className="hidden  space-y-4 border-t border-gray-200 pt-6 text-sm font-medium  lg:block">
                <Text className="flex items-center justify-between">
                  <dt className="">
                    Subtotal{" "}
                    <span className="ml-4 font-semibold">
                      {values.items.length}
                    </span>
                  </dt>
                  <dd>{fCurrencyVND(subTotal)}</dd>
                </Text>

                <Text className="flex items-center justify-between">
                  <span className="text-base">Delivery Price </span>
                  <Strong className="text-base">
                    {fCurrencyVND(values.deliveryPrice)}
                  </Strong>
                </Text>

                <Text className="flex items-center justify-between">
                  <span className="text-base">Total </span>
                  <Strong className="text-base">
                    {fCurrencyVND(summaryBill.total)}
                  </Strong>
                </Text>
                {currentData && (
                  <>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                      <dt className="text-base">Payment Status </dt>
                      <dd className="text-base">
                        {/* <Badge
                          color={
                            currentData?.paymentStatus === PaymentStatus.PAID
                              ? "green"
                              : "yellow"
                          }
                        >
                          {currentData?.paymentStatus}s
                        </Badge> */}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                      <dt className="text-base">Order Status</dt>
                      <dd className="text-base">
                        {/* <Badge
                          color={
                            StatusColor[
                              currentData?.status.toUpperCase() as keyof typeof StatusColor
                            ]
                          }
                        >
                          {currentData?.status}
                        </Badge> */}
                      </dd>
                    </div>
                  </>
                )}

                {/* {values.paymentMethod === PaymentMethod.CASH &&
                  values.orderType === OrderType.IN_STORE &&
                  values.paymentStatus === PaymentStatus.UNPAID && (
                    <PayCashHelper totalAmount={summaryBill.total} />
                  )} */}
              </dl>

              <LoadingButton
                className="w-24 flex-none"
                isSubmitting={isSubmitting}
                color="blue"
                onClick={handleSubmit((data) => onSubmit(data))}
              >
                save
              </LoadingButton>

              {/* {(createMutation || updateMutation) && (
                <LoadingButton
                  className="w-24 flex-none"
                  isSubmitting={isSubmitting}
                  color="blue"
                  onClick={handleSubmit((data) => onSubmit(data))}
                >
                  save
                </LoadingButton>
              )} */}
            </BoxLabel>
          </div>
        </Fieldset>
      </ModalLayoutFullScreen>
    </FormProvider>
  );
}

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { useSuppliers } from "@/hooks/useSuppliers";
import language from "@/language/language";
import { Divider } from "@/components/divider";
import { PayCashHelper } from "./OrderNewEditForm";
import { Badge } from "@/components/badge";
import { fCurrencyVND } from "@/utils/format-number";
import { useCategories } from "@/hooks/useCategories";
import { Select } from "@/components/select";
import { ECOMMERCE_VARIABLES } from "@/config-global";
import { Strong, Text } from "@/components/text";

function ItemsForm() {
  // get select options
  const { data: warehouseOptions = [] } = useWarehouses();
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  // map products to options with category have children products
  const productOptions = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      children: products
        .filter((product) => product.category?._id === category._id)
        .map((product) => ({
          _id: product._id,
          name: product.name,
        })),
    }));
  }, [products, categories]);

  const { control, watch } = useFormContext();
  const { fields, prepend, update, remove } = useFieldArray({
    name: "items",
    control: control,
    keyName: "uuid",
  });

  const onAddItem = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const product = products.find((p) => p._id === e.target.value);
    prepend({
      _id: product?._id,
      name: product?.name,
      quantity: 1,
      price: product?.price || 0,
    } as any);
  };

  const formattedLanguage = {
    title: "Thêm Phiếu Nhập Kho Mới",
    selectWarehouse: "Chọn Kho Nhập",
    save: "Lưu Phiếu Nhập Kho",
  };
  return (
    <>
      <div className="flex flex-col lg:flex-row items-baseline gap-2 justify-between">
        <Field className="flex flex-row basis-1/2 items-baseline gap-2 mt-0 ">
          <Label className="text-nowrap">
            {formattedLanguage.selectWarehouse}
          </Label>

          <RHFSelectField
            className="min-w-full"
            name="warehouse"
            options={warehouseOptions.map((warehouse) => ({
              label: warehouse.name,
              value: warehouse._id,
            }))}
          />
        </Field>
        <Field className="flex flex-row basis-1/2 items-baseline gap-2 ">
          <Label className="text-nowrap">Chọn mặt hàng</Label>
          <Select onChange={onAddItem}>
            <option></option>
            {productOptions.map((category) => (
              <optgroup key={category._id} label={category.name}>
                {category.children?.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </Field>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full overflow-auto lg:overflow-x-hidden">
          <Table grid striped bleed dense>
            <TableHead>
              <TableRow>
                <TableHeader>Mặt hàng</TableHeader>
                <TableHeader>Số lượng</TableHeader>
                <TableHeader>Giá</TableHeader>
                <TableHeader className="max-w-16" />
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((item: any, index: number) => (
                <TableRow key={item.uuid}>
                  <TableCell className="font-medium">
                    {item?.name}
                  </TableCell>
                  <TableCell className="text-zinc-500 max-w-20">
                    <RHFTextField
                      name={`items.${index}.quantity`}
                      type="number"
                    />
                  </TableCell>
                  <TableCell className="text-zinc-500 max-w-16">
                    <RHFTextCurrencyField
                      disabled
                      name={`items.${index}.price`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button plain onClick={() => remove(index)}>
                      <XMarkIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
