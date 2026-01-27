import Link from "next/link";
import { ProductGridListMain } from "@/sections/list/product-list";
import { fetchCategories, fetchProducts } from "@/actions/fetchData";
import paths from "@/router/path";

export default async function HomePage() {
  const [products = [], categories = []] = await Promise.all([
    await fetchProducts(),
    await fetchCategories(),
  ]);

  return (
    <main className="relative pb-24">
      <div className="px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight ">Booking Coffee</h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-gray-500">
          Welcome to Booking Coffee, your go-to destination for premium coffee
          beans and accessories. Explore our wide selection and find your
          perfect brew today!
        </p>
        <p>
          <Link href={paths.dashboard.root} >
            App Login
          </Link>
        </p>
      </div>

      <ProductGridListMain products={products} categories={categories} />
    </main>
  );
}
