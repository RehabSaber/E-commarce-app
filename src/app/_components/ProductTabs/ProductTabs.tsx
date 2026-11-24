"use client";
import React, { useState } from "react";
import { FiCheck, FiBox, FiStar, FiTruck } from "react-icons/fi";
import { FaStar, FaShieldAlt } from "react-icons/fa";

interface ProductTabsProps {
  product: any;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"details" | "reviews" | "shipping">("details");

  return (
    <div className="mt-16 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">

      <div className="flex gap-8 border-b border-gray-200 px-6 bg-white">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-2 py-4 font-medium text-sm transition-colors border-b-2 -mb-px cursor-pointer ${
            activeTab === "details"
              ? "text-[#3AA34A] border-[#3AA34A]"
              : "text-gray-500 border-transparent hover:text-gray-800"
          }`}
        >
          <FiBox size={16} className={activeTab === "details" ? "text-[#3AA34A]" : "text-gray-500"} /> Product Details
        </button>
        
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex items-center gap-2 py-4 font-medium text-sm transition-colors border-b-2 -mb-px cursor-pointer ${
            activeTab === "reviews"
              ? "text-[#3AA34A] border-[#3AA34A]"
              : "text-gray-500 border-transparent hover:text-gray-800"
          }`}
        >
          <FiStar size={16} className={activeTab === "reviews" ? "text-[#3AA34A]" : "text-gray-500"} /> Reviews ({product?.ratingsQuantity || 0})
        </button>

        <button
          onClick={() => setActiveTab("shipping")}
          className={`flex items-center gap-2 py-4 font-medium text-sm transition-colors border-b-2 -mb-1px cursor-pointer ${
            activeTab === "shipping"
              ? "text-[#3AA34A] border-[#3AA34A]"
              : "text-gray-500 border-transparent hover:text-gray-800"
          }`}
        >
          <FiTruck size={16} className={activeTab === "shipping" ? "text-[#3AA34A]" : "text-gray-500"} /> Shipping & Returns
        </button>
      </div>

      <div className="p-8">
        
 
        {activeTab === "details" && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">About this Product</h3>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              {product?.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
              <div className="bg-gray-50/70 p-6 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4 text-base">Product Information</h4>
                <div className="flex justify-between border-b border-gray-200/60 py-3 text-sm">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-900">{product?.category?.name}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200/60 py-3 text-sm">
                  <span className="text-gray-500">Subcategory</span>
                  <span className="font-medium text-gray-900">
                    {product?.subcategory?.[0]?.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200/60 py-3 text-sm">
                  <span className="text-gray-500">Brand</span>
                  <span className="font-medium text-gray-900">{product?.brand?.name}</span>
                </div>
                <div className="flex justify-between py-3 text-sm">
                  <span className="text-gray-500">Items Sold</span>
                  <span className="font-medium text-gray-900">{product?.sold}+ sold</span>
                </div>
              </div>
          
              <div className="bg-gray-50/70 p-6 rounded-xl border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4 text-base">Key Features</h4>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-center gap-3 text-gray-700">
                    <FiCheck className="text-[#3AA34A]" size={18} /> Premium Quality Product
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <FiCheck className="text-[#3AA34A]" size={18} /> 100% Authentic Guarantee
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <FiCheck className="text-[#3AA34A]" size={18} /> Fast & Secure Packaging
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <FiCheck className="text-[#3AA34A]" size={18} /> Quality Tested
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

  
        {activeTab === "reviews" && (
          <div>
            <div className="flex flex-col md:flex-row gap-10 items-center border-b border-gray-100 pb-8 mb-8">
              <div className="flex flex-col items-center justify-center bg-gray-50/70 p-8 rounded-2xl border border-gray-100 min-w-55">
                <span className="text-5xl font-bold text-gray-900 mb-2">{product?.ratingsAverage || 0}</span>
                <div className="flex text-yellow-400 mb-2 gap-0.5">
                  <FaStar size={18} /><FaStar size={18} /><FaStar size={18} /><FaStar size={18} /><FaStar size={18} className="text-gray-300" />
                </div>
                <span className="text-xs text-gray-500">Based on {product?.ratingsQuantity || 0} reviews</span>
              </div>

              <div className="flex-1 w-full space-y-3">

                <div className="flex items-center gap-4 text-sm">
                  <span className="w-16 text-gray-600">5 star</span>
                  <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full w-[25%] rounded-full"></div>
                  </div>
                  <span className="w-12 text-gray-500 text-right">25%</span>
                </div>
 
                <div className="flex items-center gap-4 text-sm">
                  <span className="w-16 text-gray-600">4 star</span>
                  <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full w-[60%] rounded-full"></div>
                  </div>
                  <span className="w-12 text-gray-500 text-right">60%</span>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="w-16 text-gray-600">3 star</span>
                  <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full w-[25%] rounded-full"></div>
                  </div>
                  <span className="w-12 text-gray-500 text-right">25%</span>
                </div>
    
                <div className="flex items-center gap-4 text-sm">
                  <span className="w-16 text-gray-600">2 star</span>
                  <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full w-[5%] rounded-full"></div>
                  </div>
                  <span className="w-12 text-gray-500 text-right">5%</span>
                </div>
 
                <div className="flex items-center gap-4 text-sm">
                  <span className="w-16 text-gray-600">1 star</span>
                  <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full w-[5%] rounded-full"></div>
                  </div>
                  <span className="w-12 text-gray-500 text-right">5%</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                <FaStar size={22} />
              </div>
              <p className="text-gray-500 text-sm mb-3">Customer reviews will be displayed here.</p>
              <button className="text-[#3AA34A] font-medium text-sm hover:underline cursor-pointer">
                Write a Review
              </button>
            </div>
          </div>
        )}

 
        {activeTab === "shipping" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
              <div className="bg-[#E5FDED]/50 border border-[#d2f1d5] p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3AA34A] text-white flex items-center justify-center">
                    <FiTruck size={20} />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">Shipping Information</h4>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><FiCheck className="text-[#3AA34A]" size={16} /> Free shipping on orders over $50</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#3AA34A]" size={16} /> Standard delivery: 3-5 business days</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#3AA34A]" size={16} /> Express delivery available (1-2 business days)</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#3AA34A]" size={16} /> Track your order in real-time</li>
                </ul>
              </div>

  
              <div className="bg-[#e8f6ea]/50 border border-[#d2f1d5] p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#3AA34A] text-white flex items-center justify-center">
                    <FiTruck size={20} className="rotate-180" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base">Returns & Refunds</h4>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-center gap-2"><FiCheck className="text-[#3AA34A]" size={16} /> 30-day hassle-free returns</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#3AA34A]" size={16} /> Full refund or exchange available</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#3AA34A]" size={16} /> Free return shipping on defective items</li>
                  <li className="flex items-center gap-2"><FiCheck className="text-[#3AA34A]" size={16} /> Easy online return process</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50/80 border border-gray-200/80 p-5 rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200/70 flex items-center justify-center text-gray-600 shrink-0">
                <FaShieldAlt size={22} />
              </div>
              <div>
                <h5 className="font-bold text-gray-900 text-sm mb-1">Buyer Protection Guarantee</h5>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Get a full refund if your order doesn't arrive or isn't as described. We ensure your shopping experience is safe and secure.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}