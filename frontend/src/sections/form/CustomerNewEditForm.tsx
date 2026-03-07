"use client";
// React Hook Form
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormProvider,
  RHFSelectField,
  RHFTextField,
  RHFCheckBoxField,
} from "@/hooks/RectHookForm";

import { useEffect, useMemo } from "react";
import { FieldGroup, Fieldset } from "@/components/fieldset";
import { useRouter } from "next/navigation";
import { CreateCustomerDto, Customer } from "@/types/customer";

import _, { add, first } from "lodash";
import { LoadingButton } from "@/components/loading";
import { Button } from "@/components/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import {
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
  useLazyCustomerByPhone,
} from "@/hooks/useCustomers";
import { useRoles } from "@/hooks/useRoles";
import { ModalLayout } from "@/components/modal";
import vietNamLocation from "@/mock/provinces_and_wards_full.json";
import { BoxLabel } from "@/components/box";

interface FormValuesProps extends CreateCustomerDto {}

type Props = {
  currentData?: Customer;
};

// export default function CustomerNewEditForm({ currentData }: Props) {
//   const isEditing = !!currentData;
//   const router = useRouter();
//   // // Initialize mutation hooks
//   const createMutation = useCreateCustomer();
//   const updateMutation = useUpdateCustomer();

//   const defaultValues = useMemo(
//     () => ({
//       firstName: currentData?.firstName || "",
//       phone: currentData?.phone || "",
//       email: currentData?.email || "",
//       gender: currentData?.gender || "male",
//       status: currentData?.status || "active",
//       isActive: currentData?.isActive ?? true,
//       notes: currentData?.notes || "",
//       //optional
//       company: currentData?.company || "",
//       //address,
//       province: currentData?.province || "79",
//       ward: currentData?.ward || "",
//       address: currentData?.address || "",
//     }),
//     [currentData],
//   );

//   const schema = Yup.object().shape({
//     firstName: Yup.string().required().min(2).max(50),
//     phone: Yup.string().required().min(10).max(15),
//     email: Yup.string().email(),
//     gender: Yup.string().oneOf(["male", "female", "other"]).required(),
//     status: Yup.string().oneOf(["active", "inactive", "suspended"]).required(),
//     isActive: Yup.boolean().required(),
//     notes: Yup.string().max(500),
//     // //optional
//     company: Yup.string().min(2).max(50),
//     // //address
//     province: Yup.string(),
//     ward: Yup.string().test(
//       "ward-required-if-province",
//       "Ward is required if province is selected",
//       function (value) {
//         const { province } = this.parent;
//         if (province) {
//           return !!value;
//         }
//         return true;
//       },
//     ),
//     address: Yup.string()
//       .min(5)
//       .max(100)
//       .test(
//         "address-required-if-province",
//         "Address is required if province is selected",
//         function (value) {
//           const { province } = this.parent;
//           if (province) {
//             return !!value;
//           }
//           return true;
//         },
//       ),
//   });

//   const methods = useForm<FormValuesProps>({
//     resolver: yupResolver(schema),
//     defaultValues,
//   });

//   const {
//     setError,
//     handleSubmit,
//     formState: { isSubmitting },
//   } = methods;

//   const onSubmit = async (data: FormValuesProps) => {
//     await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
//     try {
//       isEditing && currentData?._id
//         ? await updateMutation?.mutateAsync({
//             id: currentData._id,
//             data,
//           })
//         : await createMutation?.mutateAsync(data);

//       router.back();
//     } catch (errors: any) {
//       _.isArray(errors?.message) &&
//         errors?.message.length > 0 &&
//         errors.message.map((err: any) => {
//           setError(err.field, {
//             type: "manual",
//             message: err.message,
//           });
//         });
//     }
//   };

//   useEffect(() => {
//     methods.reset({
//       firstName: currentData?.firstName || "",
//       phone: currentData?.phone || "",
//       email: currentData?.email || "",
//       gender: currentData?.gender || "male",
//       status: currentData?.status || "active",
//       isActive: currentData?.isActive ?? true,
//       notes: currentData?.notes || "",
//       //optional
//       company: currentData?.company || "",
//       //address,
//       province: currentData?.province || "79",
//       ward: currentData?.ward || "",
//       address: currentData?.address || "",
//     });
//   }, [currentData]);

//   return (
//     <ModalLayout dialogTitle={isEditing ? "Edit Customer" : "Add Customer"}>
//       <FormProvider methods={methods}>
//         <Fieldset className="space-y-6" disabled={isSubmitting}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <BoxLabel label="Thông tin chính" className="space-y-3">
//               <RHFTextField name="firstName" label="Họ và tên" required />

//               <RHFTextField
//                 name="phone"
//                 label="Phone"
//                 autoFocus
//                 required
//                 onBlur={handleFindPhoneBlur}
//                 onKeyDown={handlePhoneKeyDown}
//               />
//               <RHFTextField name="email" label="Email" />

//               <RHFSelectField
//                 name="gender"
//                 label="Giới Tính"
//                 options={[
//                   { label: "Nam", value: "male" },
//                   { label: "Nữ", value: "female" },
//                   { label: "Khác", value: "other" },
//                 ]}
//               />
//               <RHFTextField name="company" label="Tên công ty" />
//               <RHFTextField name="notes" label="Ghi chú" />
//               <RHFCheckBoxField
//                 name="isActive"
//                 label="Kích hoạt"
//                 color="blue"
//               />
//             </BoxLabel>

//             <BoxLabel label="Địa chỉ" className="space-y-3">
//               <RHFSelectField
//                 name="province"
//                 label="Tỉnh/Thành phố"
//                 options={provinceList}
//               />

//               <RHFSelectField
//                 name="ward"
//                 label="Phường/Xã"
//                 options={
//                   selectedProvince?.wards?.map((ward: any) => ({
//                     label: ward.name,
//                     value: ward.code,
//                   })) ?? []
//                 }
//               />

//               <RHFTextField name="address" label="Số nhà, đường" />
//             </BoxLabel>
//           </div>

//           {(createMutation || updateMutation) && (
//             <LoadingButton
//               isSubmitting={isSubmitting}
//               color="blue"
//               onClick={handleSubmit((data) => onSubmit(data))}
//             >
//               Lưu
//             </LoadingButton>
//           )}
//         </Fieldset>
//       </FormProvider>
//     </ModalLayout>
//   );
// }

type FindProps = {
  onClose: () => void;
  setCustomerData: (customer: Customer) => void;
};

export function CustomerFindNewEditForm({
  onClose,
  setCustomerData,
}: FindProps) {
  // fetch data options
  const { provinces, table } = vietNamLocation;
  // find customer by phone when on blur phone input
  const { data: currentData, mutate } = useLazyCustomerByPhone();
  const isEditing = !!currentData;
  // // Initialize mutation hooks
  const createMutation = useCreateCustomer();
  const updateMutation = useUpdateCustomer();

  const defaultValues = useMemo(
    () => ({
      firstName: currentData?.firstName || "",
      phone: currentData?.phone || "",
      email: currentData?.email || "",
      gender: currentData?.gender || "male",
      status: currentData?.status || "active",
      isActive: currentData?.isActive ?? true,
      notes: currentData?.notes || "",
      //optional
      company: currentData?.company || "",
      //address,
      province: currentData?.province || "79",
      ward: currentData?.ward || "",
      address: currentData?.address || "",
    }),
    [currentData, mutate],
  );

  const schema = Yup.object().shape({
    firstName: Yup.string().required().min(2).max(50),
    phone: Yup.string().required().min(10).max(15),
    email: Yup.string().email(),
    gender: Yup.string().oneOf(["male", "female", "other"]).required(),
    status: Yup.string().oneOf(["active", "inactive", "suspended"]).required(),
    isActive: Yup.boolean().required(),
    notes: Yup.string().max(500),
    // //optional
    company: Yup.string().min(2).max(50),
    // //address
    province: Yup.string(),
    ward: Yup.string().test(
      "ward-required-if-province",
      "Ward is required if province is selected",
      function (value) {
        const { province } = this.parent;
        if (province) {
          return !!value;
        }
        return true;
      },
    ),
    address: Yup.string()
      .min(5)
      .max(100)
      .test(
        "address-required-if-province",
        "Address is required if province is selected",
        function (value) {
          const { province } = this.parent;
          if (province) {
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

  const {
    setError,
    handleSubmit,
    watch,
    formState: { isSubmitting, dirtyFields },
  } = methods;

  const isDirty = Object.keys(dirtyFields).length > 0;

  const onSubmit = async (data: FormValuesProps) => {
    // check if isEditing but no dirtyFields, then just close modal without call api
    if (isEditing && !isDirty) {
      setCustomerData(currentData);
      onClose();
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
    try {
      const customer =
        isEditing && currentData?._id
          ? await updateMutation?.mutateAsync({
              id: currentData._id,
              data,
            })
          : await createMutation?.mutateAsync(data);
      setCustomerData(customer as Customer);
      onClose();
    } catch (errors: any) {
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
    methods.reset({
      firstName: currentData?.firstName || "",
      phone: currentData?.phone || "",
      email: currentData?.email || "",
      gender: currentData?.gender || "male",
      status: currentData?.status || "active",
      isActive: currentData?.isActive ?? true,
      notes: currentData?.notes || "",
      //optional
      company: currentData?.company || "",
      //address,
      province: currentData?.province || "79",
      ward: currentData?.ward || "",
      address: currentData?.address || "",
    });
  }, [currentData]);

  const values = watch();

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

  const handleFindPhoneBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    if (!phone) return;
    mutate(phone);
  };

  const handlePhoneKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key !== "Enter") return;
    const phone = e.currentTarget.value;
    if (!phone) return;
    mutate(phone);
  };

  console.log("watch", methods.formState.errors);

  useEffect(() => {
    if (currentData) {
      methods.reset({
        firstName: currentData?.firstName || "",
        phone: currentData?.phone || "",
        email: currentData?.email || "",
        gender: currentData?.gender || "male",
        status: currentData?.status || "active",
        isActive: currentData?.isActive ?? true,
        notes: currentData?.notes || "",
        //optional
        company: currentData?.company || "",
        //address,
        province: currentData?.province || "79",
        ward: currentData?.ward || "",
        address: currentData?.address || "",
      });
    }
  }, [currentData, methods.reset]);

  return (
    <ModalLayout
      onClose={onClose}
      dialogTitle={isEditing ? "Edit Customer" : "Add Customer"}
      size="5xl"
    >
      <FormProvider methods={methods}>
        <Fieldset className="space-y-6" disabled={isSubmitting}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BoxLabel label="Thông tin chính" className="space-y-3">
              <RHFTextField name="firstName" label="Họ và tên" required />

              <RHFTextField
                name="phone"
                label="Phone"
                autoFocus
                required
                onBlur={handleFindPhoneBlur}
                onKeyDown={handlePhoneKeyDown}
              />
              <RHFTextField name="email" label="Email" />

              <RHFSelectField
                name="gender"
                label="Giới Tính"
                options={[
                  { label: "Nam", value: "male" },
                  { label: "Nữ", value: "female" },
                  { label: "Khác", value: "other" },
                ]}
              />
              <RHFTextField name="company" label="Tên công ty" />
              <RHFTextField name="notes" label="Ghi chú" />
              <RHFCheckBoxField
                name="isActive"
                label="Kích hoạt"
                color="blue"
              />
            </BoxLabel>

            <BoxLabel label="Địa chỉ" className="space-y-3">
              <RHFSelectField
                name="province"
                label="Tỉnh/Thành phố"
                options={provinceList}
              />

              <RHFSelectField
                name="ward"
                label="Phường/Xã"
                options={
                  selectedProvince?.wards?.map((ward: any) => ({
                    label: ward.name,
                    value: ward.code,
                  })) ?? []
                }
              />

              <RHFTextField name="address" label="Số nhà, đường" />
            </BoxLabel>
          </div>

          {(createMutation || updateMutation) && (
            <LoadingButton
              isSubmitting={isSubmitting}
              color="blue"
              onClick={handleSubmit((data) => onSubmit(data))}
            >
              {!isDirty ? "Chọn" : "Lưu"}
            </LoadingButton>
          )}
        </Fieldset>
      </FormProvider>
    </ModalLayout>
  );
}
