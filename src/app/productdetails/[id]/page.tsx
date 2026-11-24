import Link from "next/link";
import { FaStar, FaStarHalfAlt, FaHome } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import ProductGallery from "@/app/_components/ProductGallery/ProductGallery";
import ProductActions from "@/app/_components/ProductActions/ProductActions";
import ProductTabs from "@/app/_components/ProductTabs/ProductTabs";
import { ProductType } from "./../../_components/FeaturdProducts/FeaturdProducts";
import { FaTruck, FaShield, FaArrowRotateLeft } from "react-icons/fa6";

export default async function Productdetails(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;

  async function getSingleProduct(): Promise<ProductType | undefined> {
    try {
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/products/${id}`,
      );
      const data = await res.json();
      return data.data;
    } catch (err) {
      return undefined;
    }
  }

  const myProduct = await getSingleProduct();

  if (!myProduct) {
    return (
      <div className="text-center py-20 text-xl font-bold">
        Product Not Found
      </div>
    );
  }

  const hasDiscount =
    myProduct.priceAfterDiscount !== undefined &&
    myProduct.priceAfterDiscount < myProduct.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((myProduct.price - myProduct.priceAfterDiscount!) / myProduct.price) *
          100,
      )
    : 0;

  const currentPrice = hasDiscount
    ? myProduct.priceAfterDiscount!
    : myProduct.price;

  return (
    <div className="container mx-auto px-4 py-8 mb-16">
      <div className="flex items-center text-sm text-gray-500 gap-2 mb-8 mt-4">
        <Link
          href="/"
          className="flex items-center gap-1 hover:text-green-600 transition-colors"
        >
          <FaHome size={16} className="text-slate-600" />
          <span>Home</span>
        </Link>
        <FiChevronRight size={16} className="text-gray-400" />
        <Link
          href={`/categories/${myProduct?.category?._id}`}
          className="hover:text-green-600 transition-colors"
        >
          {myProduct?.category?.name}
        </Link>
        {myProduct?.subcategory && myProduct.subcategory.length > 0 && (
          <>
            <FiChevronRight size={16} className="text-gray-400" />
            <span className="hover:text-green-600 cursor-pointer transition-colors">
              {myProduct?.subcategory[0]?.name}
            </span>
          </>
        )}
        <FiChevronRight size={16} className="text-gray-400" />
        <span className="text-slate-800 font-medium truncate max-w-50 md:max-w-md">
          {myProduct?.title}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <ProductGallery
          imageCover={myProduct.imageCover}
          images={myProduct.images}
          title={myProduct.title}
        />

        <div className="w-full lg:w-2/3 flex flex-col">
          <div className="flex gap-2 mb-3">
            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
              {myProduct?.category?.name}
            </span>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
              {myProduct?.brand?.name}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {myProduct?.title}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex text-yellow-400">
              <FaStar size={18} />
              <FaStar size={18} />
              <FaStar size={18} />
              <FaStar size={18} />
              <FaStarHalfAlt size={18} />
            </div>
            <span className="text-sm text-gray-500">
              {myProduct?.ratingsAverage} ({myProduct?.ratingsQuantity} reviews)
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            {hasDiscount ? (
              <>
                <span className="text-3xl font-bold text-slate-900">
                  {myProduct.priceAfterDiscount} EGP
                </span>
                <span className="text-lg text-gray-400 line-through">
                  {myProduct.price} EGP
                </span>
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Save {discountPercentage}%
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold text-slate-900">
                {myProduct.price} EGP
              </span>
            )}
          </div>

          <div className="flex mb-6">
            <span className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-green-600"></div>
              In Stock
            </span>
          </div>

          <hr className="border-gray-100 mb-6" />

          <p className="text-gray-600 text-sm mb-8 leading-relaxed">
            {myProduct?.description}
          </p>

          <ProductActions
            productId={myProduct._id}
            availableQuantity={myProduct.quantity}
            price={currentPrice}
          />

          <div className="flex flex-col sm:flex-row justify-between gap-6 border-t border-b border-gray-100 py-6 mt-2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e8f6ea] flex items-center justify-center text-[#10b981] shrink-0">
                <FaTruck size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">
                  Free Delivery
                </span>
                <span className="text-xs text-gray-500">Orders over $50</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e8f6ea] flex items-center justify-center text-[#10b981] shrink-0">
                <FaArrowRotateLeft size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">
                  30 Days Return
                </span>
                <span className="text-xs text-gray-500">Money back</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#e8f6ea] flex items-center justify-center text-[#10b981] shrink-0">
                <FaShield size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">
                  Secure Payment
                </span>
                <span className="text-xs text-gray-500">100% Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductTabs product={myProduct} />
    </div>
  );
}