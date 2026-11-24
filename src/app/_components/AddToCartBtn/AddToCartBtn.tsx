"use client"
import React, { useState } from "react"
import { FaPlus } from "react-icons/fa"
import { toast } from "sonner"
import { addToCartAction } from "@/app/cart/cart.actions"

export default function AddToCartBtn({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)

  async function handleAdd() {
    setLoading(true)
    const res = await addToCartAction(productId)
    if (res.success) {
      toast.success(res.message)
      window.dispatchEvent(new Event("cart-change"))
    } else {
      toast.error(res.message)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="w-10 h-10 bg-[#0aad0a] text-white rounded-full flex items-center justify-center hover:bg-[#088f08] transition-colors shadow-sm cursor-pointer relative z-20 disabled:opacity-60"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      ) : (
        <FaPlus size={16} />
      )}
    </button>
  )
}