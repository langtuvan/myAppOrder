"use client";
import { useMemo } from "react";
import { useCartStore } from "../store/cart";
import { useRouter } from "next/navigation";
import { CheckIcon, ClockIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { products } from "@/store/poducts";
import { fCurrencyVND } from "@/utils/format-number";
import UseImage from "@/hooks/useImage";
import { deliveryMethods } from "@/hooks/useOrders";
import { ECOMMERCE_VARIABLES } from "@/config-global";

export default function CartSumary() {
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const deliveryPrice = useCartStore((s) => s.deliveryPrice);
  const taxes = useCartStore((s) => s.taxes);
  const discount = useCartStore((s) => s.discount);
  const totalAmount = useCartStore((s) => s.totalAmount);

  const clear = useCartStore((s) => s.clear);

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [items],
  );
  const count = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items],
  );

  if (!hasHydrated) {
    return <div className="text-sm ">Đang tải giỏ hàng…</div>;
  }

  const { push } = useRouter();

  return (
    <main className="pb-16 dark:bg-zinc-900 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl pt-16">
          <h1 className="text-3xl font-bold tracking-tight ">Shopping Cart</h1>

          <div className="my-12">
            <section aria-labelledby="cart-heading">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              {items.length === 0 ? (
                <p className="text-zinc-500">Giỏ hàng trống.</p>
              ) : (
                <ul
                  role="list"
                  className="divide-y overflow-y-auto divide-gray-200 border-t border-b border-gray-200"
                >
                  {items.map((product, productIdx) => (
                    <li key={product.product} className="flex py-6 sm:py-10">
                      <div className="shrink-0">
                        <UseImage
                          alt={product.productName}
                          width={1}
                          height={1}
                          src={product?.imageSrc}
                          className="size-20  sm:size-24"
                        />
                      </div>

                      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                        <div>
                          <div className="flex justify-between sm:grid sm:grid-cols-2">
                            <div className="pr-6 py-3">
                              <h3 className="text-sm">
                                <a className="font-medium  ">
                                  {product.productName}
                                </a>
                              </h3>
                              <p className="mt-1 text-sm  dark:text-white/70">
                                {fCurrencyVND(product.price)}
                              </p>
                            </div>

                            <p className="text-right text-sm font-medium ">
                              {fCurrencyVND(product.price * product.quantity)}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center sm:absolute sm:top-0 sm:left-1/2 sm:mt-0 sm:block">
                            <div className="flex items-center gap-2">
                              <button
                                className="h-7 w-7 rounded border border-zinc-300 dark:border-zinc-700"
                                disabled={product.quantity <= 1}
                                onClick={() =>
                                  updateQuantity(
                                    product._id!,
                                    Math.max(0, product.quantity - 1),
                                  )
                                }
                              >
                                −
                              </button>
                              <span className="w-6 text-center tabular-nums">
                                {product.quantity}
                              </span>
                              <button
                                className="h-7 w-7 rounded border border-zinc-300 dark:border-zinc-700"
                                onClick={() =>
                                  updateQuantity(
                                    product._id!,
                                    product.quantity + 1,
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(product._id!)}
                              className="ml-4 text-sm font-medium text-red-600 hover:text-red-500 sm:mt-3 sm:ml-0"
                            >
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className=" sm:ml-32 sm:pl-6"
            >
              <div className="rounded-lg  px-4 py-6 sm:p-6 lg:p-8">
                <h2 id="summary-heading" className="sr-only">
                  Order summary
                </h2>

                <div className="flow-root">
                  <dl className="-my-4 divide-y divide-gray-200 text-sm">
                    <div className="flex items-center justify-between py-4">
                      <dt className="">Subtotal</dt>
                      <dd className="font-medium ">{fCurrencyVND(subtotal)}</dd>
                    </div>
                    <div className="flex items-center justify-between py-4">
                      <dt className="">Shipping</dt>
                      <dd className="font-medium ">
                        {fCurrencyVND(deliveryPrice)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between py-4">
                      <dt className="">
                        Tax{" "}
                        <span className="bg-zinc-200 ml-2 text-gray-600 rounded-md p-2">
                          {ECOMMERCE_VARIABLES.taxRate * 100}%
                        </span>
                      </dt>
                      <dd className="font-medium ">{fCurrencyVND(taxes)}</dd>
                    </div>
                    <div className="flex items-center justify-between py-4">
                      <dt className="text-base font-medium ">Order total</dt>
                      <dd className="text-base font-medium ">
                        {fCurrencyVND(totalAmount >= 0 ? totalAmount : 0)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <div className="mt-10">
                <button
                  type="button"
                  onClick={() => {
                    push("/check-out");
                  }}
                  className="min-w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 dark:bg-slate-50 dark:text-gray-900 dark:hover:bg-slate-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
                >
                  Checkout
                </button>
              </div>

              <div className="my-6 text-center text-sm ">
                <p>
                  or{" "}
                  <Link
                    href="/"
                    className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Continue Shopping
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
