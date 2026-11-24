"use client"
import React, { useState } from "react"
import { FiHeart } from "react-icons/fi"
import { FaHeart } from "react-icons/fa"
import { toast } from "sonner"
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "@/app/wishlist/wishlist.actions"

export default function WishlistBtn({ productId }: { productId: string }) {
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    if (isSaved) {
      const res = await removeFromWishlistAction(productId)
      if (res.success) {
        setIsSaved(false)
        toast.success("Removed from wishlist")
        window.dispatchEvent(new Event("wishlist-change"))
      }
    } else {
      const res = await addToWishlistAction(productId)
      if (res.success) {
        setIsSaved(true)
        toast.success(res.message)
        window.dispatchEvent(new Event("wishlist-change"))
      } else {
        toast.error(res.message)
      }
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-gray-100 transition-colors cursor-pointer ${
        isSaved
          ? "bg-red-50 text-red-500"
          : "bg-white text-slate-600 hover:bg-red-500 hover:text-white"
      }`}
    >
      {isSaved ? <FaHeart size={14} /> : <FiHeart size={15} />}
    </button>
  )
}