"use client";
import { Button } from "@/components/button";
import { useProducts } from "@/hooks/useProducts";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { useState } from "react";
import { ProductListFormPicker } from "./list/product-list";
import { Input } from "@/components/input";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function ProductPicker({ disabled }: { disabled?: boolean }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const { data: products = [] } = useProducts();

  const datafiltered =
    query === ""
      ? products
      : products.filter((product) => {
          return product.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <>
      <Button disabled={disabled} plain onClick={() => setOpen(true)}>
        <PlusIcon /> Add Product
      </Button>
      <Dialog
        className="relative z-10 min-w-6xl"
        open={open}
        onClose={() => {
          setOpen(false);
          setQuery("");
        }}
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/25 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:bg-gray-900/50"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
          <DialogPanel
            transition
            className="mx-auto max-w-4xl  p-2 py-6 space-y-2 transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl outline-1 outline-black/5 transition-all data-closed:scale-95 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in dark:divide-white/10 dark:bg-gray-900 dark:-outline-offset-1 dark:outline-white/10"
          >
            <Input value={query} onChange={(e) => setQuery(e.target.value)} />
            <ProductListFormPicker data={datafiltered} />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
