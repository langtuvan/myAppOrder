"use server";
import { HOST_API } from "@/config-global";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { revalidateTag } from "next/cache";

export async function fetchProducts() {
  try {
    const res = await fetch(HOST_API + "/products", {
      method: "GET",
      next: { tags: ["products"] },
      cache: "force-cache",
    });
    return res.json() as Promise<Product[]>;
  } catch (error) {}
}
export async function fetchCategories() {
  try {
    const res = await fetch(HOST_API + "/categories", {
      method: "GET",
      next: { tags: ["categories"] },
      cache: "force-cache",
    });
    return res.json() as Promise<Category[]>;
  } catch (error) {}
}

export async function validateProduct() {
   revalidateTag("products", "max");
}
export async function validateCategory() {
   revalidateTag("categories", "max");
}
