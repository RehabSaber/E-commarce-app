import React from "react";
import Link from "next/link";
import { FiRefreshCcw, FiEye } from "react-icons/fi";
import { FaStar, FaStarHalfAlt, FaRegStar, FaBoxOpen } from "react-icons/fa";
import AddToCartBtn from "../_components/AddToCartBtn/AddToCartBtn";
import WishlistBtn from "../WishlistBtn/WishlistBtn";


export interface ProductType {
  sold: number;
  images: string[];
  subcategory: [{ [key: string]: any }];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  imageCover: string;
  category: CategoryType;
  brand: BrandType;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  id: string;
  availableColors?: string[];
  priceAfterDiscount?: number;
}

export interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface BrandType {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export default async function Shop() {
  async function getAllProducts(): Promise<ProductType[] | undefined> {
    try {
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/products`,
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

  const allproducts = await getAllProducts();

  return (
    <div>
      <div className="bg-linear-to-r from-[#0aad0a] to-[#00c853] text-white py-10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-white/80 mb-5">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Shop</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <FaBoxOpen className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Shop</h1>
              <p className="text-sm text-white/90">Explore our products</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {allproducts?.map((product) => {
            const hasDiscount = product.priceAfterDiscount !== undefined;
            const discountPercentage = hasDiscount
              ? Math.round(
                  ((product.price - product.priceAfterDiscount!) /
                    product.price) *
                    100
                )
              : 0;

            return (
              <div
                key={product._id}
                className="group relative bg-white border border-gray-200 rounded-md p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-full"
              >
                {hasDiscount && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{discountPercentage}%
                  </div>
                )}

                <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                  <WishlistBtn productId={product._id} />
                  <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-slate-600 hover:bg-green-600 hover:text-white transition-colors cursor-pointer">
                    <FiRefreshCcw size={15} />
                  </button>

                  <Link href={`/productdetails/${product.id}`}>
                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 text-slate-600 hover:bg-green-600 hover:text-white transition-colors cursor-pointer">
                      <FiEye size={15} />
                    </button>
                  </Link>
                </div>

                <div className="w-full h-56 mb-3 flex items-center justify-center rounded-md overflow-hidden">
                  <img
                    src={product.imageCover}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <div className="flex flex-col grow">
                  <span className="text-xs text-gray-500 mb-1">
                    {product.category.name}
                  </span>

                  <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 min-h-11">
                    {product.title}
                  </h3>

                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const starValue = index + 1;
                        if (product.ratingsAverage >= starValue) {
                          return (
                            <FaStar
                              key={index}
                              size={16}
                              className="text-yellow-400"
                            />
                          );
                        } else if (product.ratingsAverage >= starValue - 0.5) {
                          return (
                            <FaStarHalfAlt
                              key={index}
                              size={16}
                              className="text-yellow-400"
                            />
                          );
                        } else {
                          return (
                            <FaRegStar
                              key={index}
                              size={16}
                              className="text-yellow-400"
                            />
                          );
                        }
                      })}
                    </div>
                    <span className="text-sm text-gray-500 ml-1 mt-0.5">
                      {product.ratingsAverage} ({product.ratingsQuantity})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      {hasDiscount ? (
                        <>
                          <span className="font-bold text-lg text-green-600">
                            {product.priceAfterDiscount} EGP
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {product.price} EGP
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-lg text-gray-900">
                          {product.price} EGP
                        </span>
                      )}
                    </div>
                    <AddToCartBtn productId={product._id} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}