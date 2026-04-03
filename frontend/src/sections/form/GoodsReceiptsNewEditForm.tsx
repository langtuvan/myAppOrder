"use client";
// React Hook Form
import * as Yup from "yup";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormProvider,
  RHFTextField,
  RHFSelectField,
  RHFTextCurrencyField,
} from "@/hooks/RectHookForm";
import {
  useCreateGoodsReceipt,
  useUpdateGoodsReceipt,
  useDeleteGoodsReceipt,
} from "@/hooks/useGoodsReceipts";
import { useEffect, useMemo, useState } from "react";
import { Field, Fieldset, Label } from "@/components/fieldset";
import { useRouter } from "next/navigation";

import _ from "lodash";
import { LoadingButton } from "@/components/loading";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/button";
import { GoodsReceipt, GoodsReceiptItemDto } from "@/types/goodReceipt";
import { useWarehouses } from "@/hooks/useWarehouses";
import { useProducts } from "@/hooks/useProducts";
import { PlusCircle } from "lucide-react";
import { Combobox, ComboboxLabel, ComboboxOption } from "@/components/combobox";
import { ModalLayout } from "@/components/modal";
import { BoxLabel } from "@/components/box";
import { DialogActions } from "@/components/dialog";
import { useLanguageStore } from "@/store/language";

//type FormValuesProps = CreateGoodsReceiptDto;

type FormValuesProps = {
  supplier: string;
  invoiceNumber?: string;
  invoiceDate?: string;
  note?: string;
  //status: GoodsReceiptStatus;
  items: GoodsReceiptItemDto[];
};

type Props = {
  currentData?: GoodsReceipt;
};

export default function GoodsReceiptsNewEditForm({ currentData }: Props) {
  const locale = useLanguageStore((state) => state.locale);
  const isEditing = !!currentData;
  const { data: suppliers = [] } = useSuppliers();
  // Mutations
  const createMutation = useCreateGoodsReceipt();
  const updateMutation = useUpdateGoodsReceipt();
  const deleteMutation = useDeleteGoodsReceipt();

  const defaultValues = useMemo(
    () => ({
      supplier: currentData?.supplier || "",
      invoiceNumber: currentData?.invoiceNumber || "",
      invoiceDate:
        currentData?.invoiceDate || new Date().toISOString().split("T")[0],
      note: currentData?.note || "",
      //status: currentData?.status || GoodsReceiptStatus.DRAFT,
      items:
        currentData?.items?.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          warehouse: item.warehouse,
        })) || [],
    }),
    [currentData],
  );

  const schema = Yup.object().shape({
    supplier: Yup.string().required(
      locale === "vi" ? "Nha cung cap la bat buoc" : "Supplier is required",
    ),
    invoiceNumber: Yup.string().optional(),
    invoiceDate: Yup.string().optional(),
    note: Yup.string().optional(),
    // status: Yup.mixed<GoodsReceiptStatus>()
    //   .oneOf(Object.values(GoodsReceiptStatus), "Trạng thái không hợp lệ")
    //   .required("Trạng thái là bắt buộc"),
    items: Yup.array()
      .of(
        Yup.object().shape({
          product: Yup.object()
            .shape({
              _id: Yup.string().required(
                locale === "vi"
                  ? "San pham la bat buoc"
                  : "Product is required",
              ),
              name: Yup.string().required(),
            })
            .required(
              locale === "vi" ? "San pham la bat buoc" : "Product is required",
            ),
          quantity: Yup.number()
            .typeError(
              locale === "vi"
                ? "So luong phai la mot so"
                : "Quantity must be a number",
            )
            .positive(
              locale === "vi"
                ? "So luong phai lon hon 0"
                : "Quantity must be greater than 0",
            )
            .required(
              locale === "vi" ? "So luong la bat buoc" : "Quantity is required",
            ),
          price: Yup.number()
            .typeError(
              locale === "vi" ? "Gia phai la mot so" : "Price must be a number",
            )
            .min(
              0,
              locale === "vi"
                ? "Gia phai lon hon hoac bang 0"
                : "Price must be greater than or equal to 0",
            )
            .required(
              locale === "vi" ? "Gia la bat buoc" : "Price is required",
            ),
          warehouse: Yup.object()
            .shape({
              _id: Yup.string().required(
                locale === "vi"
                  ? "Kho nhap la bat buoc"
                  : "Warehouse is required",
              ),
              name: Yup.string().required(),
            })
            .required(
              locale === "vi"
                ? "Kho nhap la bat buoc"
                : "Warehouse is required",
            ),
        }),
      )
      .min(
        1,
        locale === "vi"
          ? "Phai co it nhat mot mat hang"
          : "At least one item is required",
      )
      .required(
        locale === "vi" ? "Mat hang la bat buoc" : "Items are required",
      ),
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

  const onDelete = async () => {
    await deleteMutation?.mutateAsync(currentData?._id as string);
    router.back();
  };

  useEffect(() => {
    reset();
  }, [currentData]);

  const formattedLanguage = {
    title: locale === "vi" ? "Them phieu nhap kho" : "Add Goods Receipt",
    invoice: locale === "vi" ? "Phieu nhap" : "Receipt",
    invoiceNumber: locale === "vi" ? "So hoa don" : "Invoice Number",
    invoiceDate: locale === "vi" ? "Ngay hoa don" : "Invoice Date",
    supplier: locale === "vi" ? "Nha cung cap" : "Supplier",
    chooseSupplier: locale === "vi" ? "Chon nha cung cap" : "Select supplier",
    note: locale === "vi" ? "Ghi chu" : "Note",
    itemsInfo: locale === "vi" ? "Thong tin nhap" : "Receipt Items",
    selectWarehouse: locale === "vi" ? "Chon kho nhap" : "Select Warehouse",
    selectProduct: locale === "vi" ? "Chon mat hang" : "Select Product",
    tableProduct: locale === "vi" ? "Mat hang" : "Product",
    tableQuantity: locale === "vi" ? "So luong" : "Quantity",
    tablePrice: locale === "vi" ? "Gia" : "Price",
    tableWarehouse: locale === "vi" ? "Kho nhap" : "Warehouse",
    save: locale === "vi" ? "Luu" : "Save",
    cancel: locale === "vi" ? "Huy" : "Cancel",
  };

  return (
    <ModalLayout
      className="md:min-w-7xl bg-zinc-100"
      dialogTitle={formattedLanguage.title}
    >
      <FormProvider methods={methods}>
        <Fieldset className="space-y-6" disabled={isSubmitting}>
          <div className="grid grid-cols-1 gap-6">
            {/* {phiếu nhập} */}
            <BoxLabel
              label={formattedLanguage.invoice}
              className="bg-white dark:bg-zinc-800 p-4  rounded-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <RHFTextField
                  name="invoiceNumber"
                  label={formattedLanguage.invoiceNumber}
                  className="flex flex-row items-baseline gap-2"
                />
                <RHFTextField
                  name="invoiceDate"
                  label={formattedLanguage.invoiceDate}
                  type="date"
                  className="flex flex-row items-baseline gap-2"
                />
                <RHFSelectField
                  name="supplier"
                  label={formattedLanguage.supplier}
                  className="flex flex-row items-baseline gap-2"
                  options={[
                    { value: "", label: formattedLanguage.chooseSupplier },
                    ...suppliers?.map((supplier) => ({
                      value: supplier._id,
                      label: supplier.name,
                    })),
                  ]}
                />
                <RHFTextField
                  name="note"
                  label={formattedLanguage.note}
                  type="text"
                  className="flex flex-row items-baseline gap-2"
                />
              </div>
            </BoxLabel>

            {/* {thông tin nhập} */}
            <ItemsForm />
          </div>

          {isEditing && deleteMutation && (
            <Button plain onClick={handleSubmit(() => onDelete())}>
              <TrashIcon />
            </Button>
          )}

          <DialogActions>
            {(createMutation || updateMutation) && (
              <LoadingButton
                autoFocus
                isSubmitting={isSubmitting}
                color="blue"
                onClick={handleSubmit((data) => onSubmit(data))}
              >
                {formattedLanguage.save}
              </LoadingButton>
            )}
            <Button plain onClick={() => router.back()}>
              {formattedLanguage.cancel}
            </Button>
          </DialogActions>
        </Fieldset>
      </FormProvider>
    </ModalLayout>
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

function ItemsForm() {
  const locale = useLanguageStore((state) => state.locale);
  // get select options
  const { data: warehouseOptions = [] } = useWarehouses();
  const { data: productOptions = [] } = useProducts();
  const { control } = useFormContext();
  const { fields, prepend, update, remove } = useFieldArray({
    name: "items",
    control: control,
    keyName: "id",
  });

  const [value, setValue] = useState({
    product: { _id: "", name: "" },
    warehouse: { _id: "", name: "" },
  });

  const onAddItem = () => {
    if (!value.product._id || !value.warehouse._id) {
      return;
    }
    prepend({ ...value, quantity: 1, price: 0 } as any);
  };

  const formattedLanguage = {
    itemsInfo: locale === "vi" ? "Thong tin nhap" : "Receipt Items",
    selectWarehouse: locale === "vi" ? "Chon kho nhap" : "Select Warehouse",
    selectProduct: locale === "vi" ? "Chon mat hang" : "Select Product",
    tableProduct: locale === "vi" ? "Mat hang" : "Product",
    tableQuantity: locale === "vi" ? "So luong" : "Quantity",
    tablePrice: locale === "vi" ? "Gia" : "Price",
    tableWarehouse: locale === "vi" ? "Kho nhap" : "Warehouse",
  };
  return (
    <div>
      <BoxLabel
        label={formattedLanguage.itemsInfo}
        className="bg-white dark:bg-zinc-800 p-4  rounded-md"
      >
        <div className="flex flex-row items-baseline gap-2 justify-between">
          <div className="w-full grow grid grid-cols-1 md:grid-cols-2 gap-2 items-center justify-between">
            <Field className="flex flex-row items-baseline gap-2 mt-0 ">
              <Label className="text-nowrap">
                {formattedLanguage.selectWarehouse}
              </Label>

              <Combobox
                refName="warehouse"
                value={value.warehouse}
                onChange={(val: any) =>
                  setValue({
                    ...value,
                    warehouse: { _id: val._id, name: val.name },
                  })
                }
                name="warehouse"
                options={warehouseOptions}
                displayValue={(warehouse) => warehouse?.name || ""}
              >
                {(warehouse) => (
                  <ComboboxOption value={warehouse}>
                    <ComboboxLabel>{warehouse.name}</ComboboxLabel>
                  </ComboboxOption>
                )}
              </Combobox>
            </Field>
            <Field className="flex flex-row items-baseline gap-2 ">
              <Label className="text-nowrap">
                {formattedLanguage.selectProduct}
              </Label>
              <Combobox
                refName="product"
                value={value.product}
                onChange={(val: any) =>
                  setValue({
                    ...value,
                    product: { _id: val._id, name: val.name },
                  })
                }
                name="product"
                options={productOptions}
                displayValue={(product) => product?.name}
              >
                {(product) => (
                  <ComboboxOption value={product}>
                    <ComboboxLabel>{product.name}</ComboboxLabel>
                  </ComboboxOption>
                )}
              </Combobox>
            </Field>
          </div>
          <Button className="flex-none text-end" plain onClick={onAddItem}>
            <PlusCircle />
          </Button>
        </div>
      </BoxLabel>
      <Table grid striped dense className="mt-6 ">
        <TableHead>
          <TableRow>
            <TableHeader>{formattedLanguage.tableProduct}</TableHeader>
            <TableHeader>{formattedLanguage.tableQuantity}</TableHeader>
            <TableHeader>{formattedLanguage.tablePrice}</TableHeader>
            <TableHeader>{formattedLanguage.tableWarehouse}</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((item: any, index: number) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.product?.name}
              </TableCell>
              <TableCell>
                <RHFTextField name={`items.${index}.quantity`} type="number" />
              </TableCell>
              <TableCell className="text-zinc-500">
                <RHFTextCurrencyField name={`items.${index}.price`} />
              </TableCell>
              <TableCell>{item.warehouse?.name}</TableCell>
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
  );
}
