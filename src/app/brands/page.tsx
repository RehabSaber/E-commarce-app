import React from "react";
import Link from "next/link";
import { FaTags } from "react-icons/fa6";

interface BrandType {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export default async function Brands() {
  async function getAllBrands(): Promise<BrandType[] | undefined> {
    try {
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/brands`,
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

  const allBrands = await getAllBrands();

  return (
    <div>
   
      <div className="bg-linear-to-r from-[#0aad0a] to-[#00c853] text-white py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-5">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Brands</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <FaTags className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Top Brands</h1>
              <p className="text-sm text-white/90">Shop from your favorite brands</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {allBrands?.map((brand) => (
            <Link
              href={`/brands/${brand._id}`}
              key={brand._id}
              className="group bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-between gap-3 shadow-sm hover:shadow-lg hover:border-green-300 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-full h-24 rounded-xl bg-gray-50/70 flex items-center justify-center p-3 overflow-hidden">
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h2 className="text-slate-700 group-hover:text-green-600 font-semibold text-sm text-center transition-colors">
                {brand.name}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}