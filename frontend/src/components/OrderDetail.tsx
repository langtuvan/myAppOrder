import { deliveryMethods, WebsiteOrderDto } from "@/hooks/useOrders";
import { fCurrencyVND } from "@/utils/format-number";
import vietNamLocation from "@/mock/provinces_and_wards_full.json";
import { useEffect, useState } from "react";
import Link from "next/link";
import UseImage from "@/hooks/useImage";
import { getLocation } from "@/utils/getLocation";

export default function OrderDetail({ order }: { order: WebsiteOrderDto }) {
  const [findLocation, setFindLocation] = useState("");
  useEffect(() => {
    setFindLocation(getLocation(order?.province, order?.ward).fullLocation);
  }, [order]);

  const deliveryInfo = deliveryMethods.find(
    (dm) => dm.id === order.deliveryMethod
  );
  return (
    <main className=" px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="max-w-xl">
          <h1 className="text-base font-medium text-indigo-600 dark:text-white">
            Thank you!
          </h1>
          <p className="mt-2 text-4xl font-bold tracking-tight">
            It's on the way!
          </p>
          <p className="mt-2 text-base text-gray-500">
            Your order #14034056 has shipped and will be with you soon.
          </p>

          <dl className="mt-12 text-sm font-medium">
            <dt className="">Tracking number</dt>
            <dd className="mt-2 text-indigo-600 dark:text-white">
              {order.trackingNumber}
            </dd>
          </dl>
        </div>

        <section
          aria-labelledby="order-heading"
          className="mt-10 border-t border-gray-200"
        >
          <h2 id="order-heading" className="sr-only">
            Your order
          </h2>

          <h3 className="sr-only">Items</h3>
          {order?.items?.map((product, index) => (
            <div
              key={"order-detail-" + `${index}` + product._id}
              className="flex space-x-6 border-b border-gray-200 py-10"
            >
              <UseImage
                alt={product.productName}
                src={product.imageSrc}
                className="size-20 flex-none rounded-lg bg-gray-100 object-cover sm:size-40"
              />
              <div className="flex flex-auto flex-col ml-3">
                <div>
                  <h4 className="font-medium ">
                    <a href="#">{product.productName}</a>
                  </h4>
                  <p className="mt-2 text-sm ">{product.status}</p>
                </div>
                <div className="mt-2 flex flex-1 items-end">
                  <dl className="flex divide-x divide-gray-200 text-sm">
                    <div className="flex pr-4 sm:pr-6">
                      <dt className="font-medium ">Quantity</dt>
                      <dd className="ml-2 ">{product.quantity}</dd>
                    </div>
                    <div className="flex pl-4 sm:pl-6">
                      <dt className="font-medium">Price</dt>
                      <dd className="ml-2 ">{fCurrencyVND(product.price)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          ))}

          <div className="sm:ml-40 sm:pl-6">
            <h3 className="sr-only">Your information</h3>

            <h4 className="sr-only">Addresses</h4>
            <dl className="grid grid-cols-2 gap-x-6 py-10 text-sm">
              <div>
                <dt className="font-medium ">Shipping address</dt>
                <dd className="mt-2 ">
                  <address className="not-italic">
                    <span className="block">{order.customerName}</span>
                    <span className="block">{order.address}</span>
                    <span className="block">{findLocation}</span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium ">Billing address</dt>
                <dd className="mt-2 ">
                  <address className="not-italic">
                    <span className="block">{order.customerName}</span>
                    <span className="block">{order.address}</span>
                    <span className="block">{findLocation}</span>
                  </address>
                </dd>
              </div>
            </dl>

            <h4 className="sr-only">Payment</h4>
            <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 py-10 text-sm">
              <div>
                <dt className="font-medium ">Payment method</dt>
                <dd className="mt-2 ">
                  <p>{order.paymentMethod}</p>
                  <p>{order.paymentStatus}</p>
                  {/* <p>Mastercard</p> */}
                  {/* <p>
                    <span aria-hidden="true">••••</span>
                    <span className="sr-only">Ending in </span>1545
                  </p> */}
                </dd>
              </div>
              <div>
                <dt className="font-medium ">Shipping method</dt>
                <dd className="mt-2 ">
                  <p>{deliveryInfo?.title}</p>
                  <p>{deliveryInfo?.turnaround}</p>
                </dd>
              </div>
            </dl>

            <h3 className="sr-only">Summary</h3>

            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium ">Subtotal</dt>
                <dd className="">{fCurrencyVND(order?.subTotal || 0)}</dd>
              </div>

              <div className="flex justify-between">
                <dt className="font-medium ">Shipping</dt>
                <dd className="">{fCurrencyVND(order?.deliveryPrice)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex font-medium ">
                  Discount
                  {/* <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs ">
                    STUDENT50
                  </span> */}
                </dt>
                <dd className="">{fCurrencyVND(order?.discount || 0)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="flex font-medium ">
                  Taxes
                  <span className="ml-2 rounded-full bg-gray-200 text-gray-600 px-2 py-0.5 text-xs ">
                    {order?.taxes * 100}%
                  </span>
                </dt>
                <dd className="">
                  {fCurrencyVND(
                    ((order?.taxes * (order?.subTotal ?? 0)) as number) || 0
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium ">Total</dt>
                <dd className="">{fCurrencyVND(order?.totalAmount || 0)}</dd>
              </div>
            </dl>
          </div>
          <div className="my-6 text-center text-sm text-gray-500">
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
    </main>
  );
}
