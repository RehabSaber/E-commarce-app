import React from "react";
import Link from "next/link";
import type { CategoryType } from "../FeaturdProducts/FeaturdProducts";
import { FaArrowRight } from "react-icons/fa6";

export default async function HomeCategories() {
  async function getAllCategories(): Promise<CategoryType[] | undefined> {
    try {
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/categories`,
        {
          cache: "force-cache",
        }
      );
      const data = await res.json();
      return data.data;
    } catch (err) {
      return undefined;
    }
  }

  const allCategories = await getAllCategories();

  return (
    <div className="w-[90%] mx-auto my-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold border-l-[6px] border-[#0F9F46] pl-3 flex gap-2">
          <span className="text-slate-900">Shop By</span>
          <span className="text-[#0F9F46]">Category</span>
        </h1>

        <Link
          href="/categories"
          className="text-[#0F9F46] hover:text-green-800 transition-colors flex items-center gap-2 font-medium"
        >
          View All Categories <FaArrowRight className="text-sm" />
        </Link>
      </div>

      <div className="flex flex-wrap -mx-2">
        {allCategories?.map((category) => (
          <Link
            href={`/categories/${category._id}`}
            className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6 p-2"
            key={category._id}
          >
            <div className="border border-gray-100 rounded-xl p-5 flex flex-col gap-4 items-center shadow-sm hover:shadow-md hover:border-green-200 transition-all bg-white cursor-pointer h-full">
              <img
                src={category.image}
                className="size-24 rounded-full object-cover"
                alt={category.name}
              />
              <h2 className="text-slate-800 font-medium text-sm text-center">
                {category.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}