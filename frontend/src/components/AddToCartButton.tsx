"use client";
import { useState, useTransition } from "react";
import { useCartStore } from "../store/cart";
import { uuidv7 } from "uuidv7";

type Props = {
  // _id: string;
  product: string;
  productName: string;
  imageSrc: string;
  quantity?: number;
  price: number;
  status: string;
  className?: string;
};

export default function AddToCartButton({
  // _id,
  product,
  productName,
  imageSrc,
  price,
  status,
  quantity = 1,
  className,
}: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  return (
    <button
      //type="button"
      className={
        className ??
        "rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 disabled:opacity-50"
      }
      disabled={pending}
      onClick={() => {
        startTransition(() => {
          addItem(
            {
              _id: uuidv7(),
              product,
              productName,
              imageSrc,
              price,
              status: "pending",
            },
            quantity
          );
          setAdded(true);
          setTimeout(() => setAdded(false), 1000);
        });
      }}
    >
      {pending ? "Adding" : added ? "added" : "Add to Cart"}
    </button>
  );
}
