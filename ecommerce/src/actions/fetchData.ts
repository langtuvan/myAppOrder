"use server";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { HOST_API_URL } from "@/utils/axios";
import { revalidateTag } from "next/cache";

export async function fetchProducts() {
  try {
    const res = await fetch(HOST_API_URL + "/products", {
      method: "GET",
      next: { tags: ["products"] },
      cache: "force-cache",
    });
    return res.json() as Promise<Product[]>;
  } catch (error) {}
}
export async function fetchCategories() {
  try {
    const res = await fetch(HOST_API_URL + "/categories", {
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
