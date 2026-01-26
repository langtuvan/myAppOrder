"use client";
import { Button } from "@/components/button";
import { Heading } from "@/components/heading";
import {
  OrderStatus,
  useOrderList,
} from "@/hooks/useOrders";
import paths from "@/router/path";
import OrderList from "@/sections/list/order-list";
import { Input } from "@/components/input";
import { Radio } from "@/components/radio";
import * as Headless from "@headlessui/react";
import { Select } from "@/components/select";

const statusOptions = [...Object.values(OrderStatus)];
export default function ProductPage() {
  const onSelect = (id: string) => {
    router.push(paths.dashboard.orders.edit(id));
  };

  const {
    router,
    selectedDate,
    setSelectedDate,
    currentStatus,
    setCurrentStatus,
    dataFiltered,
  } = useOrderList({ statusOptions, defaultStatus: OrderStatus.PENDING });

  return (
    <>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>Order List</Heading>
        <div className="flex gap-4">
          <Button href={paths.dashboard.orders.create} plain>
            Add New
          </Button>
        </div>
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
                  defaultChecked={status === OrderStatus.PENDING}
                />
                <Headless.Label className="text-base/6 select-none sm:text-sm/6 capitalize">
                  {status}
                </Headless.Label>
              </Headless.Field>
            ))}
          </Headless.RadioGroup>
        </Headless.Fieldset>
        <Select
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
          trackingNumber: true,
          orderType: true,
          paymentMethod: true,
          totalAmount: true,
          paymentStatus: true,
        }}
      />
    </>
  );
}
