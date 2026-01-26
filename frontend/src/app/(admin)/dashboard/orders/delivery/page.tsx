"use client";
import * as Headless from "@headlessui/react";
import { Heading } from "@/components/heading";
import { Input } from "@/components/input";
import { Radio } from "@/components/radio";
import { Select } from "@/components/select";
import { OrderStatus } from "@/hooks/useOrders";
import paths from "@/router/path";
import OrderList from "@/sections/list/order-list";
import {
  useOrderList,
  DeliveryStatusOptions as statusOptions,
} from "@/hooks/useOrders";

export default function ProductPage() {
  const onSelect = (id: string) => {
    router.push(paths.dashboard.orders.delivery(id));
  };
  const {
    router,
    selectedDate,
    setSelectedDate,
    currentStatus,
    setCurrentStatus,
    dataFiltered,
  } = useOrderList({ statusOptions, defaultStatus: OrderStatus.EXPORTED });
  return (
    <>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Delivery List</Heading>
      </div>

      <div className="flex w-full items-baseline  flex-wrap  justify-between gap-2 border-b border-zinc-950/10 py-4 dark:border-white/10">
        <div className="flex gap-2 min-w-full lg:min-w-0">
          <Input
            className=""
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        <Headless.Fieldset>
          <Headless.RadioGroup
            name="status"
            value={currentStatus}
            onChange={setCurrentStatus}
            className="  gap-6 sm:gap-8 hidden md:flex"
          >
            {statusOptions.map((status) => (
              <Headless.Field key={status} className="flex items-center gap-2">
                <Radio
                  value={status}
                  defaultChecked={status === currentStatus}
                />
                <Headless.Label className="text-base/6 select-none sm:text-sm/6 capitalize">
                  {status}
                </Headless.Label>
              </Headless.Field>
            ))}
          </Headless.RadioGroup>
        </Headless.Fieldset>
        <Select
          value={currentStatus}
          onChange={(e) => setCurrentStatus(e.target.value)}
          className="md:hidden block"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status} className="capitalize">
              {status}
            </option>
          ))}
        </Select>
      </div>

      <OrderList
        onSelect={onSelect}
        data={dataFiltered || []}
        visibilityState={{
          orderType: true,
          trackingNumber: true,
          paymentMethod: true,
          totalAmount: true,
          customerPayCod: true,
        }}
      />
    </>
  );
}
