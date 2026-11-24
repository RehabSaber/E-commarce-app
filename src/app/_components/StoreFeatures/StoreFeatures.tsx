import React from 'react';
import { FaTruck, FaShield, FaArrowRotateLeft, FaHeadset } from 'react-icons/fa6';

export default function StoreFeatures() {
  return (
    <section className="w-full py-8 bg-white">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
        
          <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-blue-50">
              <FaTruck className="text-blue-500 text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">
                Free Shipping
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                On orders over 500 EGP
              </p>
            </div>
          </div>

         
          <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-[#0F9F46]/10">
              <FaShield className="text-[#0F9F46] text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">
                Secure Payment
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                100% secure transactions
              </p>
            </div>
          </div>


          <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-orange-50">
              <FaArrowRotateLeft className="text-orange-400 text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">
                Easy Returns
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                14-day return policy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-purple-50">
              <FaHeadset className="text-purple-500 text-lg" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-sm">
                24/7 Support
              </h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Dedicated support team
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}