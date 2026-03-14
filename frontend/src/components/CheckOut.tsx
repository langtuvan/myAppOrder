"use client";

import { useEffect, useState, useTransition } from "react";
import vietNamLocation from "@/mock/provinces_and_wards_full.json";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "./loading";

import axiosInstance from "@/utils/axios";
import { uuidv7 } from "uuidv7";
import { useFormContext } from "react-hook-form";

import { BoxLabel } from "./box";
import {
  BillingSummary,
  CartTableForm,
  CustomerInfoForm,
  OrderFormValuesProps,
} from "@/sections/form/OrderNewEditForm";

const plans = [
  { id: "cod", name: "Thanh toán khi nhận hàng", status: true },
  { id: "bank", name: "Chuyển khoản ngân hàng", status: false },
  { id: "qr", name: "Quét mã Qr", status: false },
];

export default function CheckOut() {
  //
  const { setValue } = useFormContext<OrderFormValuesProps>();
  const { items, addItem, clear } = useCartStore((s) => s);
  useEffect(() => {
    setValue("items", items);
  }, [items]);

  // const route = useRouter();
  // const [isPending, startTransition] = useTransition();
  // const onSubmit = async (data: OrderFormValuesProps) => {
  //   const _id = uuidv7();
  //   startTransition(async () => {
  //     try {
  //       await axiosInstance.post("/orders/public", {
  //         ...data,
  //         _id,
  //         items,
  //       });
  //       clear();
  //       route.replace("/order-detail/" + _id);
  //       await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate async operation
  //     } catch (error) {
  //       console.error("Failed to create order:", error);
  //     }
  //   });

  // Handle form submission here (e.g., send to API)
  // };

  // if (isPending) {
  //   return <LoadingScreen />;
  // }

  return (
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
        <CustomerInfoForm

        //currentCus={currentData?.customer}
        />

        <BoxLabel label="Thanh Toán">
          <BillingSummary />
        </BoxLabel>
      </div>
    </div>
  );
}
