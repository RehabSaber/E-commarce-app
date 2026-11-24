import React from "react";
import Link from "next/link";
import type { CategoryType } from "../_components/FeaturdProducts/FeaturdProducts";
import { FaLayerGroup } from "react-icons/fa6";

export default async function Categories() {
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
    <div>
      <div className="bg-linear-to-r from-[#0aad0a] to-[#00c853] text-white py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-5">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Categories</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <FaLayerGroup className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">All Categories</h1>
              <p className="text-sm text-white/90">Browse products by category</p>
            </div>
          </div>
        </div>
      </div>

 
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {allCategories?.map((category) => (
            <Link
              href={`/categories/${category._id}`}
              key={category._id}
              className="group bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm hover:shadow-lg hover:border-green-200 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center p-1 border border-gray-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h2 className="text-slate-800 group-hover:text-green-600 font-semibold text-base text-center transition-colors">
                {category.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}