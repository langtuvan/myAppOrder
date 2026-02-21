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
  useCreateGoodsReceipt,
  useUpdateGoodsReceipt,
  useDeleteGoodsReceipt,
} from "@/hooks/useGoodsReceipts";
import { useEffect, useMemo, useState } from "react";
import { Field, FieldGroup, Fieldset, Label } from "@/components/fieldset";
import { useRouter } from "next/navigation";

import _, { set } from "lodash";
import { LoadingButton } from "@/components/loading";
import { Warehouse, CreateWarehouseDto } from "@/types/warehouse";
import { TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/button";
import {
  GoodsReceipt,
  CreateGoodsReceiptDto,
  GoodsReceiptItemDto,
  GoodsReceiptStatus,
} from "@/types/goodReceipt";
import { on } from "events";
import { useWarehouses } from "@/hooks/useWarehouses";
import { useProducts } from "@/hooks/useProducts";
import { Input } from "@/components/input";
import { PlusCircle } from "lucide-react";
import { Combobox, ComboboxLabel, ComboboxOption } from "@/components/combobox";
import { ModalLayout } from "@/components/modal";
import { BoxLabel } from "@/components/box";
import { DialogActions } from "@/components/dialog";

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
    supplier: Yup.string().required("Nhà cung cấp là bắt buộc"),
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
    title: "Thêm Phiếu Nhập Kho Mới",
    selectWarehouse: "Chọn Kho Nhập",
    save: "Lưu Phiếu Nhập Kho",
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
              label="Phiếu Nhập"
              className="bg-white dark:bg-zinc-800 p-4  rounded-md"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <RHFTextField
                  name="invoiceNumber"
                  label="Số Hóa Đơn"
                  className="flex flex-row items-baseline gap-2"
                />
                <RHFTextField
                  name="invoiceDate"
                  label="Ngày Hóa Đơn"
                  type="date"
                  className="flex flex-row items-baseline gap-2"
                />
                <RHFSelectField
                  name="supplier"
                  label="Nhà Cung Cấp"
                  className="flex flex-row items-baseline gap-2"
                  options={[
                    { value: "", label: "Chọn Nhà Cung Cấp" },
                    ...suppliers?.map((supplier) => ({
                      value: supplier._id,
                      label: supplier.name,
                    })),
                  ]}
                />
                <RHFTextField
                  name="note"
                  label="Ghi Chú"
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
              Cancel
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
    title: "Thêm Phiếu Nhập Kho Mới",
    selectWarehouse: "Chọn Kho Nhập",
    save: "Lưu Phiếu Nhập Kho",
  };
  return (
    <div>
      <BoxLabel
        label="Thông Tin Nhập"
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
              <Label className="text-nowrap">Chọn mặt hàng</Label>
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
            <TableHeader>Mặt hàng</TableHeader>
            <TableHeader>Số lượng</TableHeader>
            <TableHeader>Giá</TableHeader>
            <TableHeader>Kho Nhập</TableHeader>
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
