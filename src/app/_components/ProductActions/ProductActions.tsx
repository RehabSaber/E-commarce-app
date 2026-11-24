"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaShoppingCart, FaBolt, FaHeart } from "react-icons/fa";
import { FiHeart, FiShare2 } from "react-icons/fi";
import { toast } from "sonner";
import {
  addToCartAction,
  updateCartQuantityAction,
} from "@/app/cart/cart.actions";
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/app/wishlist/wishlist.actions";

interface ProductActionsProps {
  productId: string;
  availableQuantity: number;
  price: number;
}

export default function ProductActions({
  productId,
  availableQuantity,
  price,
}: ProductActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);

  const increase = () => {
    if (quantity < availableQuantity) setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const totalPrice = quantity * price;

  async function handleAddToCart(redirectToCart = false) {
    setLoading(true);
    const res = await addToCartAction(productId);

    if (res.success) {
      if (quantity > 1) {
        await updateCartQuantityAction(productId, quantity);
      }
      toast.success(res.message);
      window.dispatchEvent(new Event("cart-change"));

      if (redirectToCart) {
        router.push("/cart");
      }
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  }

  async function handleToggleWishlist() {
    setWishLoading(true);
    if (isSaved) {
      const res = await removeFromWishlistAction(productId);
      if (res.success) {
        setIsSaved(false);
        toast.success("Removed from wishlist");
        window.dispatchEvent(new Event("wishlist-change"));
      }
    } else {
      const res = await addToWishlistAction(productId);
      if (res.success) {
        setIsSaved(true);
        toast.success(res.message);
        window.dispatchEvent(new Event("wishlist-change"));
      } else {
        toast.error(res.message);
      }
    }
    setWishLoading(false);
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Product link copied to clipboard!");
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-gray-700 font-medium w-16">Quantity</span>
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            type="button"
            onClick={decrease}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            -
          </button>
          <span className="px-4 py-2 border-l border-r border-gray-300 font-medium w-12 text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increase}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            +
          </button>
        </div>
        <span className="text-xs text-gray-500">
          {availableQuantity} available
        </span>
      </div>

      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg mb-4">
        <span className="text-gray-600 font-medium">Total Price:</span>
        <span className="text-2xl font-bold text-green-600">
          {totalPrice.toFixed(2)} EGP
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <button
          type="button"
          onClick={() => handleAddToCart(false)}
          disabled={loading}
          className="flex-1 bg-[#1ba14f] text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 font-semibold hover:bg-[#15803D] transition-all duration-300 cursor-pointer disabled:opacity-60"
        >
          <FaShoppingCart size={18} />
          {loading ? "Adding..." : "Add to Cart"}
        </button>

        <button
          type="button"
          onClick={() => handleAddToCart(true)}
          disabled={loading}
          className="flex-1 bg-[#0f172a] text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 font-semibold hover:bg-[#1e293b] transition-all duration-300 cursor-pointer disabled:opacity-60"
        >
          <FaBolt size={16} /> Buy Now
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          type="button"
          onClick={handleToggleWishlist}
          disabled={wishLoading}
          className={`flex-1 border py-3 rounded-md flex items-center justify-center gap-2 font-medium transition-all duration-300 cursor-pointer ${
            isSaved
              ? "border-red-200 bg-red-50 text-red-600"
              : "border-gray-200 bg-white text-slate-600 hover:border-red-400 hover:text-red-500"
          }`}
        >
          {isSaved ? <FaHeart size={18} /> : <FiHeart size={18} />}
          {isSaved ? "Saved in Wishlist" : "Add to Wishlist"}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="w-14 border border-gray-200 py-3 rounded-md flex items-center justify-center text-slate-600 hover:border-[#15803D] hover:text-[#15803D] transition-all duration-300 bg-white cursor-pointer"
        >
          <FiShare2 size={18} />
        </button>
      </div>
    </>
  );
}