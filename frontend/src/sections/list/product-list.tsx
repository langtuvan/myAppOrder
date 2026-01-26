"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import paths from "@/router/path";
import { Badge } from "@/components/badge";
import { Product } from "@/types/product";
import { HOST_API_BASE } from "@/config-global";
import { fCurrencyVND } from "@/utils/format-number";

import { useFieldArray, useFormContext } from "react-hook-form";
import { Item, OrderStatus } from "@/hooks/useOrders";
import { uuidv7 } from "uuidv7";
import clsx from "clsx";
import { NoImageSvg } from "@/components/no-image-svg";
import { Category } from "@/types/category";
import { Fragment } from "react/jsx-runtime";
import UseImage from "@/hooks/useImage";
import { MagnifyingGlassIcon, StarIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/button";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { paramCase } from "@/utils/change-case";
import { use, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import { Input } from "@headlessui/react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { DropDownToggleTheme } from "@/components/ThemeToggle";

export default function ProductList({ data }: { data: Product[] }) {
  return (
    <Table dense grid striped className=" w-full">
      <TableHead className="sticky top-0 z-10 bg-white dark:bg-gray-950">
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Active</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody className="overflow-auto ">
        {data &&
          data.length > 0 &&
          data.map((item) => (
            <TableRow
              key={item._id}
              href={paths.dashboard.inventory.products.edit(item._id!)}
            >
              <TableCell className="font-medium">
                <div className="flex">
                  <div className="mr-4 shrink-0">
                    {item?.images?.length > 0 ? (
                      <UseImage
                        src={item.images[0]}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md"
                      />
                    ) : (
                      <svg
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 200 200"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                        className="h-full w-16 border border-gray-300 bg-white text-gray-300 dark:border-white/15 dark:bg-gray-900 dark:text-white/15"
                      >
                        <path
                          d="M0 0l200 200M0 200L200 0"
                          strokeWidth={1}
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-md font-bold text-gray-900 dark:text-white">
                      {item.name}
                    </p>

                    <p className="mt-1 text-gray-500 dark:text-gray-400 ">
                      {fCurrencyVND(item.price!)}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="text-zinc-500 ">
                <Badge color={item.isActive ? "green" : "red"}>
                  {item.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export function ProductListFormPicker({ data }: { data: Product[] }) {
  const methods = useFormContext();
  const { fields, prepend, update, remove } = useFieldArray({
    control: methods.control,
    name: "items",
  });

  const handleAddItem = (product: any) => {
    // find existing item
    const existingIndex = fields.findIndex(
      (f: any) => f.product === product._id,
    );
    if (existingIndex !== -1) {
      // update quantity
      // const existingItem: any = fields[existingIndex];
      // update(existingIndex, {
      //   ...existingItem,
      //   quantity: existingItem.quantity + 1,
      // });
      return;
    }

    const newBooking: Item = {
      _id: uuidv7(),
      product: product._id,
      productName: product.name,
      imageSrc: product.images[0],
      quantity: 1,
      price: product.price,
      status: OrderStatus.PENDING,
    };
    prepend(newBooking);
  };

  const handleUpdateQty = (action: "increment" | "decrement", product: any) => {
    const item: any = fields.find((f: any) => f.product === product._id);
    const index = fields.findIndex((f: any) => f.product === product._id);
    if (!item) {
      return handleAddItem(product);
    }
    if (action === "decrement" && item.quantity <= 1) return;

    const newQuantity =
      action === "increment"
        ? item.quantity + 1
        : Math.max(1, item.quantity - 1);

    update(index, {
      ...item,
      quantity: newQuantity,
    });
  };

  return (
    <Table dense grid className="h-96">
      <TableHead className="sticky top-0 z-10 bg-white dark:bg-gray-950 ">
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Active</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody className="overflow-y-auto">
        {data &&
          data.length > 0 &&
          data.map((item: any, idx: number) => (
            <TableRow
              key={item._id}
              className={clsx(
                fields.find((f: any) => f.product === item._id) &&
                  "bg-slate-200 hover:bg-slate-100 select-none ",
              )}
            >
              <TableCell
                onClick={() => handleAddItem(item)}
                className="font-medium"
              >
                <div className="flex">
                  <div className="mr-4 shrink-0">
                    {item?.images?.length > 0 ? (
                      <img
                        src={HOST_API_BASE + item.images[0]}
                        alt={item.name}
                        width={64}
                        height={64}
                        className="rounded-md"
                      />
                    ) : (
                      <NoImageSvg />
                    )}
                  </div>
                  <div>
                    <p className="text-md font-bold text-gray-900 dark:text-white">
                      {item.name}
                    </p>

                    <p className="mt-1 text-gray-500 dark:text-gray-400 ">
                      {fCurrencyVND(item.price!)}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="">
                <div className="lex items-center ">
                  <div className="flex items-center gap-2">
                    <button
                      className="h-7 w-7 rounded border border-zinc-300 dark:border-zinc-700"
                      disabled={item.quantity <= 1}
                      onClick={() => handleUpdateQty("decrement", item)}
                    >
                      −
                    </button>
                    <span className="w-6 text-center tabular-nums text-gray-800 dark:text-gray-200">
                      {(
                        fields.find((f: any) => f.product === item._id) as
                          | Item
                          | undefined
                      )?.quantity || 0}
                    </span>
                    <button
                      className="h-7 w-7 rounded border border-zinc-300 dark:border-zinc-700"
                      onClick={() => handleUpdateQty("increment", item)}
                    >
                      +
                    </button>
                  </div>
                  {fields.find((f: any) => f.product === item._id) && (
                    <button
                      type="button"
                      onClick={() => remove(idx)}
                      className="ml-4 text-sm font-medium text-red-600 hover:text-red-500 sm:mt-3 sm:ml-0"
                    >
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export function ProductGridList({ query }: { query: string }) {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const methods = useFormContext();
  const { fields, prepend, update } = useFieldArray({
    control: methods.control,
    name: "items",
  });

  const handleAddItem = (product: any) => {
    // find existing item
    const existingIndex = fields.findIndex(
      (f: any) => f.product === product._id,
    );
    if (existingIndex !== -1) {
      //update quantity
      const existingItem: any = fields[existingIndex];
      update(existingIndex, {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      });
      return;
    }

    const newBooking: Item = {
      _id: uuidv7(),
      product: product._id,
      productName: product.name,
      imageSrc: product.images[0],
      quantity: 1,
      price: product.price,
      status: OrderStatus.PENDING,
    };
    prepend(newBooking);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      paramCase(product.name).includes(paramCase(query)),
  );

  return (
    <section
      aria-labelledby="products-heading"
      className="overflow-hidden  mx-auto max-w-7xl"
    >
      <h2 id="products-heading" className="sr-only">
        Products
      </h2>

      <div>
        {categories?.length > 0 &&
          categories.map((category) => (
            <Fragment key={category._id}>
              <p className="my-4 mt-12 text-lg lg:text-xl font-medium ">
                {category.name}
              </p>
              <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-5">
                {filteredProducts?.length > 0 &&
                  filteredProducts
                    .filter((product) => product.category._id === category._id)
                    .map((product) => (
                      <div
                        key={product._id}
                        className="group relative border-r border-b border-t border-gray-200 p-4 sm:p-6"
                      >
                        <UseImage
                          alt={product.name}
                          src={
                            product.images.length > 0 ? product.images[0] : ""
                          }
                          width={100}
                          height={100}
                        />
                        <div className="pt-10 pb-4 text-center">
                          <div className="mt-3 flex flex-col items-center">
                            <h3 className="text-sm font-medium ">
                              <span aria-hidden="true" className="" />
                              {product.name}
                            </h3>
                          </div>
                          <p className=" text-base font-medium ">
                            {fCurrencyVND(product.price)}
                          </p>
                          <div className="mt-4">
                            <Button
                              color="indigo"
                              onClick={() => handleAddItem(product)}
                              className="active:scale-95"
                            >
                              Add to cart
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </Fragment>
          ))}
      </div>
    </section>
  );
}

export function ProductGridListMain({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  "use client";
  // query
  const [query, setQuery] = useState("");

  const cart = useCartStore((state) => state.items);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      paramCase(product.name).includes(paramCase(query)),
  );
  return (
    <>
      {/* Filters */}
      <section
        aria-labelledby="filter-heading"
        className="grid items-center  border-t border-b border-gray-200 sticky top-0 z-10 bg-white dark:bg-zinc-800 "
      >
        <h2 id="filter-heading" className="sr-only">
          Filters
        </h2>

        <div className="lg:mx-auto lg:w-7xl items-center gap-3 flex flex-row justify-between py-4 px-4 sm:px-6 lg:px-8 ">
          <div className=" grid grid-cols-1 ">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="col-start-1 row-start-1 block w-full rounded-md bg-white py-3 pr-3 pl-10 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:pl-9 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
            />
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 ml-3 size-7 self-center text-gray-400 sm:size-4 dark:text-gray-500"
            />
          </div>
          <DropDownToggleTheme />
        </div>
      </section>

      {/* Product grid */}
      <section
        aria-labelledby="products-heading"
        className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8"
      >
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>

        <div>
          {categories?.length > 0 &&
            categories.map((category) => (
              <Fragment key={category._id}>
                <p className="my-4 mt-12 pl-3 md:pl-0 text-xl font-sans ">
                  {category.name}
                </p>
                <div className="-mx-px grid grid-cols-2 border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
                  {filteredProducts?.length > 0 &&
                    filteredProducts
                      .filter(
                        (product) => product.category._id === category._id,
                      )
                      .map((product) => (
                        <div
                          key={product._id}
                          className="group relative border-r border-b border-t border-gray-200 p-4 sm:p-6"
                        >
                          <UseImage
                            alt={product.name}
                            src={
                              product.images.length > 0 ? product.images[0] : ""
                            }
                            width={200}
                            height={200}
                            className=""
                          />
                          <div className="pt-10 pb-4 text-center">
                            {/* <h3 className="text-sm font-medium text-gray-900">
                    <a href={product.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </a>
                  </h3> */}

                            <div className="mt-3 flex flex-col items-center">
                              <h3 className="text-sm font-medium ">
                                <span aria-hidden="true" className="" />
                                {product.name}
                              </h3>
                              <p className="sr-only">5 out of 5 stars</p>
                              <div className="flex items-center">
                                {[0, 1, 2, 3, 4].map((rating) => (
                                  <StarIcon
                                    key={rating}
                                    aria-hidden="true"
                                    className={clsx(
                                      5 > rating
                                        ? "text-yellow-400"
                                        : "text-gray-200",
                                      "size-5 shrink-0",
                                    )}
                                  />
                                ))}
                              </div>
                              <p className="mt-1 text-sm text-gray-500">
                                reviews
                              </p>
                            </div>
                            <p className="mt-4 text-base font-medium ">
                              {fCurrencyVND(product.price)}
                            </p>
                            <div className="mt-4">
                              <AddToCartButton
                                product={product._id}
                                productName={product.name}
                                imageSrc={
                                  product.images.length > 0
                                    ? product.images[0]
                                    : ""
                                }
                                price={product.price}
                                status="pending"
                                quantity={1}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </Fragment>
            ))}
        </div>
      </section>

      {/* Cart summary (demo) */}

      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white dark:bg-zinc-800 p-2 md:p-4 sm:px-6 lg:px-0">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link href={cart.length > 0 ? "/cart-summary" : "#"}>
            <div className="min-w-full text-center cursor-pointer rounded-md border border-transparent bg-indigo-600 dark:bg-white dark:text-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 dark:hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden">
              Shopping Cart{" "}
              <span className="p-2 px-3 ml-3 bg-white dark:bg-zinc-800 dark:text-white rounded-full text-gray-800">
                {cart.length}
              </span>
            </div>
          </Link>
        </section>
      </div>
    </>
  );
}
